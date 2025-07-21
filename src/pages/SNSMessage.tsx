// SNSMessage.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { fetchMessageBoxes, fetchConversation, sendMessage } from "@/lib/messageApi";
import { searchUsers } from "@/lib/snsApi";

export default function SNSMessage(): JSX.Element {
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
    <>
      <div className="flex border border-[#0000001a] rounded-xl overflow-hidden w-full max-w-5xl mx-auto bg-white">
        {/* Left Message List */}
        <div className="w-[400px] border-r border-[#0000001a] flex flex-col">
          <div className="h-20 border-b border-[#0000001a] flex items-center justify-between px-6">
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
              className="bg-black text-white text-sm rounded-md h-9 px-2"
              onClick={() => setShowNewMessageModal(true)}
            >
              메시지 보내기
            </Button>
          </div>

          <div className="flex-1 overflow-auto">
            {boxes.length === 0 && (
              <div className="text-center text-gray-400 py-10">쪽지함이 비어 있습니다.</div>
            )}
            {boxes.map((box) => (
              <div
                key={box.opponentUserId}
                className={`h-[95px] border-b border-[#0000000d] p-4 flex items-start cursor-pointer ${selectedUserId === box.opponentUserId ? "bg-[#0000000d]" : ""}`}
                onClick={() => setSelectedUserId(box.opponentUserId)}
              >
                <Avatar className="w-10 h-10 mr-4">
                  <AvatarImage src={box.opponentProfileImageUrl} alt={box.opponentNickname} />
                  <AvatarFallback>{box.opponentNickname[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="text-sm font-medium leading-5">{box.opponentNickname}</h3>
                  </div>
                  <p className="text-[13px] leading-[18px] text-[#00000099] mt-1">
                    {box.lastMessageContent}
                  </p>
                  <p className="text-xs leading-4 text-[#00000066] mt-1">
                    {box.lastMessageCreatedAt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Message Detail */}
        <div className="flex-1 p-8">
          {selectedUserId && conversation.length > 0 && opponentInfo ? (
            <Card className="w-full shadow-sm border border-[#0000001a] rounded-xl">
              <CardHeader className="p-0">
                <div className="px-6 py-4 border-b border-[#0000001a] flex items-center">
                  <Avatar className="w-12 h-12 mr-4">
                    <AvatarImage src={opponentInfo.profileImageUrl} alt={opponentInfo.nickname} />
                    <AvatarFallback>{opponentInfo.nickname[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium leading-6">{opponentInfo.nickname}</h3>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {conversation.map((msg) => (
                    <div key={msg.messageId} className="mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={msg.senderProfileImageUrl} alt={msg.senderNickname} />
                          <AvatarFallback>{msg.senderNickname[0]}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">{msg.senderNickname}</span>
                        <span className="text-xs text-gray-400">{msg.createdAt}</span>
                      </div>
                      <div className="ml-10 text-base text-black mt-1">{msg.content}</div>
                    </div>
                  ))}
                </div>
                {/* 메시지 입력창 */}
                <div className="flex items-center gap-2 mt-6">
                  <input
                    className="flex-1 border rounded px-3 py-2 text-sm"
                    placeholder="메시지를 입력하세요"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !sending) handleSend(); }}
                    disabled={sending}
                  />
                  <Button 
                    className="h-10 px-6 bg-blue-500 text-white text-sm font-medium" 
                    onClick={handleSend}
                    disabled={sending || !message.trim()}
                  >
                    {sending ? "전송중..." : "전송"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center text-gray-400 py-20">대화할 메시지를 선택하세요.</div>
          )}
        </div>
      </div>

      {/* 새로운 메시지 모달 */}
      <Dialog open={showNewMessageModal} onOpenChange={setShowNewMessageModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>새 메시지 보내기</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* 유저 검색 */}
            <div>
              <label className="text-sm font-medium mb-2 block">받는 사람 검색</label>
              <Input
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
              <div className="max-h-40 overflow-y-auto border rounded-md">
                {searchResults.map((user) => (
                  <div
                    key={user.userId}
                    className={`p-3 cursor-pointer transition-colors duration-200 flex items-center gap-3 ${
                      selectedReceiver?.userId === user.userId 
                        ? "bg-blue-100 border-l-4 border-blue-500 shadow-sm" 
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
                        <span className={`text-sm font-medium ${
                          selectedReceiver?.userId === user.userId ? "text-blue-700" : ""
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
              <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg shadow-sm">
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
                  className="w-full border rounded-md px-3 py-2 text-sm min-h-[80px] resize-none"
                  placeholder="메시지를 입력하세요"
                  value={newMessageContent}
                  onChange={(e) => setNewMessageContent(e.target.value)}
                  disabled={sending}
                />
              </div>
            )}

            {/* 전송 버튼 */}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
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
