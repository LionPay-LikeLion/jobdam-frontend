// SNSMessage.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

export default function SNSMessage(): JSX.Element {
  const messages = [
    {
      id: 1,
      sender: "김민수",
      avatar: "",
      preview:
        "안녕하세요! 오늘 올리신 게시글 정말 유용했어요. 혹시 더 자세한 정보를 얻을 수 있을까요?",
      time: "2024년",
      unread: true,
      fullMessage:
        "안녕하세요! 오늘 올리신 게시글 정말 유용했어요. 혹시 더 자세한 정보를 얻을 수 있을까요? 특히 면접 준비 부분에서 말씀해주신 팁들이 정말 도움이 될 것 같습니다. 시간 되실 때 답변 부탁드려요!",
      date: "2024년 1월 15일 오후 2:30",
    },
    {
      id: 2,
      sender: "박지영",
      avatar: "",
      preview: "포트폴리오 리뷰 요청드립니다.",
      time: "2024년",
      unread: false,
    },
    {
      id: 3,
      sender: "이준호",
      avatar: "",
      preview: "스터디 그룹 참여 문의",
      time: "2024년",
      unread: false,
    },
  ];

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
                받은 메시지
              </TabsTrigger>
              <TabsTrigger
                value="sent"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none text-[#00000099]"
              >
                보낸 메시지
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button className="bg-black text-white text-sm rounded-md h-9 px-2">
            메시지 보내기
          </Button>
        </div>

        <div className="flex-1 overflow-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`h-[95px] border-b border-[#0000000d] p-4 flex items-start ${
                index === 0 ? "bg-[#0000000d]" : ""
              }`}
            >
              <Avatar className="w-10 h-10 mr-4">
                <AvatarImage src={message.avatar} alt={message.sender} />
                <AvatarFallback>{message.sender[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium leading-5">
                    {message.sender}
                  </h3>
                  {message.unread && (
                    <Badge className="w-2 h-2 rounded-full bg-[#ff4444] p-0" />
                  )}
                </div>
                <p className="text-[13px] leading-[18px] text-[#00000099] mt-1">
                  {message.preview}
                </p>
                <p className="text-xs leading-4 text-[#00000066] mt-1">
                  {message.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Message Detail */}
      <div className="flex-1 p-8">
        <Card className="w-full shadow-sm border border-[#0000001a] rounded-xl">
          <CardHeader className="p-0">
            <div className="px-6 py-4 border-b border-[#0000001a] flex items-center">
              <Avatar className="w-12 h-12 mr-4">
                <AvatarImage src="" alt="김민수" />
                <AvatarFallback>김</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-lg font-medium leading-6">김민수</h3>
                <p className="text-sm text-[#00000099] leading-5">
                  {messages[0].date}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  className="h-8 px-3 bg-[#0000000d] hover:bg-[#0000001a]"
                >
                  답장
                </Button>
                <Button
                  variant="secondary"
                  className="h-8 px-3 bg-[#0000000d] hover:bg-[#0000001a]"
                >
                  삭제
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-base leading-6">{messages[0].fullMessage}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
