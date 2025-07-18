// SNSMessage.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";
import { fetchMessageBoxes, fetchConversation, sendMessage } from "@/lib/messageApi";

export default function SNSMessage(): JSX.Element {
  const [boxes, setBoxes] = useState<any[]>([]); // 쪽지함 목록
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null); // 선택된 상대방
  const [conversation, setConversation] = useState<any[]>([]); // 대화 내역
  const [message, setMessage] = useState(""); // 입력 메시지
  const [loading, setLoading] = useState(true);
  const [opponentInfo, setOpponentInfo] = useState<{ nickname: string; profileImageUrl: string } | null>(null);

  // 쪽지함 목록 불러오기
  useEffect(() => {
    fetchMessageBoxes().then(data => {
      setBoxes(data);
      if (data.length > 0) setSelectedUserId(data[0].opponentUserId);
      setLoading(false);
    });
  }, []);

  // 대화 내역 및 상대방 정보 불러오기
  useEffect(() => {
    if (selectedUserId) {
      fetchConversation(selectedUserId).then(setConversation);
      // 상대방 정보 찾기
      const box = boxes.find(b => b.opponentUserId === selectedUserId);
      if (box) {
        setOpponentInfo({ nickname: box.opponentNickname, profileImageUrl: box.opponentProfileImageUrl });
      }
    }
  }, [selectedUserId, boxes]);

  // 메시지 전송
  const handleSend = async () => {
    if (selectedUserId && message.trim()) {
      await sendMessage(selectedUserId, message);
      setMessage("");
      fetchConversation(selectedUserId).then(setConversation);
    }
  };

  if (loading) return <div className="text-center py-10">로딩중...</div>;

  return (
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
          <Button className="bg-black text-white text-sm rounded-md h-9 px-2">
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
              <div className="space-y-4">
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
                  onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
                />
                <Button className="h-10 px-6 bg-blue-500 text-white text-sm font-medium" onClick={handleSend}>
                  전송
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center text-gray-400 py-20">대화할 메시지를 선택하세요.</div>
        )}
      </div>
    </div>
  );
}
