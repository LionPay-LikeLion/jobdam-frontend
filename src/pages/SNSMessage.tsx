// SNSMessage.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FaPaperPlane } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { fetchMessageBoxes, fetchConversation, sendMessage } from "@/lib/messageApi";
import { searchUsers } from "@/lib/snsApi";
import { useAuth } from "@/contexts/AuthContext";
import TopBar from "@/components/TopBar";

export default function SNSMessage(): JSX.Element {
  const { user } = useAuth();
  const [boxes, setBoxes] = useState<any[]>([]); // 쪽지함 목록
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null); // 선택된 상대방
  const [conversation, setConversation] = useState<any[]>([]); // 대화 내역
  const [message, setMessage] = useState(""); // 입력 메시지
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false); // 메시지 전송 중 상태
  const [opponentInfo, setOpponentInfo] = useState<{ nickname: string; profileImageUrl: string } | null>(null);

  // 새로운 메시지 모달 상태
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [newMessageContent, setNewMessageContent] = useState("");
  const [selectedReceiver, setSelectedReceiver] = useState<any>(null);

  // 쪽지함 목록 불러오기
  useEffect(() => {
    fetchMessageBoxes().then(data => {
      setBoxes(data);
      if (data.length > 0) setSelectedUserId(data[0].opponentUserId);
      setLoading(false);
    }).catch(error => {
      console.error("쪽지함 목록을 불러오는데 실패했습니다:", error);
      setLoading(false);
    });
  }, []);

  // 대화 내역 및 상대방 정보 불러오기
  useEffect(() => {
    if (selectedUserId) {
      fetchConversation(selectedUserId).then(setConversation).catch(error => {
        console.error("대화 내역을 불러오는데 실패했습니다:", error);
      });
      // 상대방 정보 찾기
      const box = boxes.find(b => b.opponentUserId === selectedUserId);
      if (box) {
        setOpponentInfo({ nickname: box.opponentNickname, profileImageUrl: box.opponentProfileImageUrl });
      }
    }
  }, [selectedUserId, boxes]);

  // 유저 검색 함수
  const handleSearchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const data = await searchUsers(query);
      setSearchResults(data);
    } catch (error) {
      console.error("유저 검색에 실패했습니다:", error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  // 검색어 변경 시 검색 실행
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // 메시지 전송
  const handleSend = async () => {
    if (selectedUserId && message.trim() && !sending) {
      setSending(true);
      try {
        await sendMessage(selectedUserId, message);
        setMessage("");
        // 메시지 전송 후 대화 내역 새로고침
        const updatedConversation = await fetchConversation(selectedUserId);
        setConversation(updatedConversation);
        // 쪽지함 목록도 업데이트 (마지막 메시지 정보 갱신)
        const updatedBoxes = await fetchMessageBoxes();
        setBoxes(updatedBoxes);
      } catch (error) {
        console.error("메시지 전송에 실패했습니다:", error);
        alert("메시지 전송에 실패했습니다. 다시 시도해주세요.");
      } finally {
        setSending(false);
      }
    }
  };

  // 새로운 메시지 전송
  const handleSendNewMessage = async () => {
    if (selectedReceiver && newMessageContent.trim() && !sending) {
      setSending(true);
      try {
        await sendMessage(selectedReceiver.userId, newMessageContent);
        setNewMessageContent("");
        setShowNewMessageModal(false);
        setSelectedReceiver(null);
        setSearchQuery("");
        setSearchResults([]);

        // 쪽지함 목록 새로고침
        const updatedBoxes = await fetchMessageBoxes();
        setBoxes(updatedBoxes);

        // 새로 생성된 대화를 선택
        const newBox = updatedBoxes.find(b => b.opponentUserId === selectedReceiver.userId);
        if (newBox) {
          setSelectedUserId(selectedReceiver.userId);
        }
      } catch (error) {
        console.error("새 메시지 전송에 실패했습니다:", error);
        alert("메시지 전송에 실패했습니다. 다시 시도해주세요.");
      } finally {
        setSending(false);
      }
    }
  };

  if (loading) return <div className="text-center py-10">로딩중...</div>;

  return (
    <><div className="min-h-screen flex flex-col bg-gray-50 font-korean">
      <TopBar />
      <div className="flex w-full max-w-5xl mx-auto mt-10 gap-6">
        {/* Left Message List */}
        <div className="w-[340px] bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col min-h-[600px]">
          <div className="h-20 border-b border-gray-100 flex items-center justify-between px-6">
            <Tabs defaultValue="received" className="w-full">
              <TabsList className="bg-transparent p-0 h-auto gap-4">
                <TabsTrigger
                  value="received"
                  className="data-[state=active]:bg-[#0000000d] data-[state=active]:shadow-none px-4 py-2 rounded-md"
                >
                  나의 메시지
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button
              className="flex items-center gap-2 px-5 py-2 rounded-md border text-base font-bold shadow transition-all duration-150 bg-blue-500 text-white hover:bg-blue-600 border-blue-400 cursor-pointer"
              onClick={() => setShowNewMessageModal(true)}
            >
              <FaPaperPlane className="w-4 h-4" />
              새 메시지
            </Button>
          </div>

          <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-gray-200">
            {boxes.length === 0 && (
              <div className="text-center text-gray-400 py-10">쪽지함이 비어 있습니다.</div>
            )}
            {boxes.map((box) => (
              <div
                key={box.opponentUserId}
                className={`h-[90px] border-b border-gray-100 p-4 flex items-center gap-3 cursor-pointer transition-all select-none
                  ${selectedUserId === box.opponentUserId ? "bg-blue-50" : "hover:bg-gray-50"}`}
                onClick={() => setSelectedUserId(box.opponentUserId)}
              >
                <Avatar className="w-10 h-10 mr-2">
                  <AvatarImage src={box.opponentProfileImageUrl} alt={box.opponentNickname} />
                  <AvatarFallback>{box.opponentNickname[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-semibold text-gray-900 truncate">{box.opponentNickname}</h3>
                  </div>
                  <p className="text-[13px] leading-[18px] text-gray-500 mt-1 truncate">
                    {box.lastMessageContent}
                  </p>
                  <p className="text-xs leading-4 text-gray-400 mt-1">
                    {box.lastMessageCreatedAt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Message Detail */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 h-full flex flex-col min-h-[600px]">
            {selectedUserId && conversation.length > 0 && opponentInfo ? (
              <>
                <div className="px-8 py-6 border-b border-gray-100 flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={opponentInfo.profileImageUrl} alt={opponentInfo.nickname} />
                    <AvatarFallback>{opponentInfo.nickname[0]}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold text-gray-900">{opponentInfo.nickname}</h3>
                </div>
                <div className="flex-1 p-8 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gray-200">
                  {conversation.map((msg) => {
                    const isMine = user && (String(msg.senderUserId ?? msg.senderId) === String(user.userId));
                    return (
                      <div
                        key={msg.messageId}
                        className={`flex mb-2 ${isMine ? "justify-end" : "justify-start"} items-start`}
                      >
                        {!isMine && (
                          <div className="flex-shrink-0 mt-1 mr-2">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={msg.senderProfileImageUrl} alt={msg.senderNickname} />
                              <AvatarFallback>{msg.senderNickname[0]}</AvatarFallback>
                            </Avatar>
                          </div>
                        )}
                        <div className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                          <div
                            className={`px-4 py-2 max-w-xs break-words text-base mt-1 shadow-sm ${isMine
                              ? "bg-blue-500 text-white rounded-2xl rounded-br-sm"
                              : "bg-gray-100 text-gray-900 rounded-2xl rounded-bl-sm"
                              }`}
                          >
                            {msg.content}
                          </div>
                          <span className="text-xs text-gray-400 mt-1">{msg.createdAt}</span>
                        </div>
                        {isMine && (
                          <div className="flex-shrink-0 mt-1 ml-2">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={msg.senderProfileImageUrl} alt={msg.senderNickname} />
                              <AvatarFallback>{msg.senderNickname[0]}</AvatarFallback>
                            </Avatar>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {/* 메시지 입력창 */}
                <div className="flex items-center gap-3 border-t border-gray-100 px-8 py-6 bg-gray-50 rounded-b-2xl">
                  <input
                    className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-base bg-white focus:ring-2 focus:ring-blue-200 outline-none shadow-sm"
                    placeholder="메시지를 입력하세요"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !sending) handleSend(); }}
                    disabled={sending}
                  />
                  <Button
                    className="h-11 px-8 bg-blue-600 text-white text-base font-bold rounded-lg shadow hover:bg-blue-700 transition"
                    onClick={handleSend}
                    disabled={sending || !message.trim()}
                  >
                    {sending ? "전송중..." : "전송"}
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center text-gray-400 text-lg">대화할 메시지를 선택하세요.</div>
            )}
          </div>
        </div>
      </div>
    </div>

      {/* 새로운 메시지 모달 */}
      <Dialog open={showNewMessageModal} onOpenChange={setShowNewMessageModal}>
        <DialogContent className="sm:max-w-md rounded-2xl shadow-lg border border-gray-100">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">새 메시지 보내기</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* 유저 검색 */}
            <div>
              <label className="text-sm font-medium mb-2 block">받는 사람 검색</label>
              <Input
                className="border border-gray-200 rounded-lg px-3 py-2 text-base bg-white focus:ring-2 focus:ring-blue-200 outline-none shadow-sm"
                placeholder="닉네임으로 검색하세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* 검색 결과 */}
            {searching && (
              <div className="text-center py-4 text-gray-500">검색중...</div>
            )}

            {!searching && searchResults.length > 0 && (
              <div className="max-h-40 overflow-y-auto border rounded-md bg-white shadow-sm">
                {searchResults.map((user) => (
                  <div
                    key={user.userId}
                    className={`p-3 cursor-pointer transition-colors duration-200 flex items-center gap-3 rounded-lg
                      ${selectedReceiver?.userId === user.userId
                        ? "bg-blue-50 border-l-4 border-blue-500 shadow"
                        : "hover:bg-gray-50 border-l-4 border-transparent"
                      }`}
                    onClick={() => setSelectedReceiver(user)}
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.profileImageUrl} alt={user.nickname} />
                      <AvatarFallback>{user.nickname[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${selectedReceiver?.userId === user.userId ? "text-blue-700" : ""
                          }`}>
                          {user.nickname}
                        </span>
                        {user.subscriptionLevelCode && (
                          <Badge variant="secondary" className="text-xs">
                            {user.subscriptionLevelCode}
                          </Badge>
                        )}
                        {user.memberTypeCode && (
                          <Badge variant="outline" className="text-xs">
                            {user.memberTypeCode}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {selectedReceiver?.userId === user.userId && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {!searching && searchQuery && searchResults.length === 0 && (
              <div className="text-center py-4 text-gray-500">검색 결과가 없습니다.</div>
            )}

            {/* 선택된 유저 표시 */}
            {selectedReceiver && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg shadow">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10 ring-2 ring-blue-300">
                      <AvatarImage src={selectedReceiver.profileImageUrl} alt={selectedReceiver.nickname} />
                      <AvatarFallback>{selectedReceiver.nickname[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-blue-800">{selectedReceiver.nickname}</span>
                      {selectedReceiver.subscriptionLevelCode && (
                        <Badge variant="secondary" className="text-xs bg-blue-200 text-blue-800">
                          {selectedReceiver.subscriptionLevelCode}
                        </Badge>
                      )}
                      {selectedReceiver.memberTypeCode && (
                        <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
                          {selectedReceiver.memberTypeCode}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-blue-600 mt-1">선택된 받는 사람</p>
                  </div>
                </div>
              </div>
            )}

            {/* 메시지 입력 */}
            {selectedReceiver && (
              <div>
                <label className="text-sm font-medium mb-2 block">메시지</label>
                <textarea
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-base min-h-[80px] resize-none bg-white focus:ring-2 focus:ring-blue-200 outline-none shadow-sm"
                  placeholder="메시지를 입력하세요"
                  value={newMessageContent}
                  onChange={(e) => setNewMessageContent(e.target.value)}
                  disabled={sending}
                />
              </div>
            )}

            {/* 전송 버튼 */}
            <div className="flex justify-end gap-2 mt-2">
              <Button
                variant="outline"
                className="rounded-lg px-5 py-2 text-base"
                onClick={() => {
                  setShowNewMessageModal(false);
                  setSelectedReceiver(null);
                  setSearchQuery("");
                  setSearchResults([]);
                  setNewMessageContent("");
                }}
              >
                취소
              </Button>
              <Button
                className="bg-blue-600 text-white rounded-lg px-6 py-2 text-base font-bold hover:bg-blue-700 transition"
                onClick={handleSendNewMessage}
                disabled={!selectedReceiver || !newMessageContent.trim() || sending}
              >
                {sending ? "전송중..." : "전송"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
