import React, { useState } from "react";

export default function CommunityMessenger() {
    const [selectedUser, setSelectedUser] = useState("김민수");

    const messages = {
        김민수: [
            { id: 1, sender: "김민수", text: "안녕하세요!", time: "오후 2:25", isMe: false },
            { id: 2, sender: "me", text: "네, 안녕하세요! 반갑습니다.", time: "오후 2:26", isMe: true },
            { id: 3, sender: "김민수", text: "오늘 날씨가 정말 좋네요.", time: "오후 2:30", isMe: false },
        ],
        이지은: [
            { id: 1, sender: "이지은", text: "금요일에 만나요!", time: "오전 9:30", isMe: false },
            { id: 2, sender: "me", text: "좋아요~", time: "오전 9:35", isMe: true },
        ],
        박준호: [],
        최수진: [],
    };

    const chatList = [
        { name: "김민수", message: "오늘 날씨가 정말 좋네요.", time: "오후 2:30" },
        { name: "이지은", message: "금요일에 만나요!", time: "오전 9:30" },
        { name: "박준호", message: "사진 잘 나왔어요 👍", time: "어제" },
        { name: "최수진", message: "고생하셨습니다", time: "2일 전" },
    ];

    return (
        <div className="min-h-screen bg-white flex justify-center items-start pt-10">
            <div className="w-full max-w-[1200px] h-[800px] bg-white flex rounded-lg shadow border overflow-hidden">
                {/* 채팅방 리스트 */}
                <div className="w-[350px] border-r p-6 overflow-y-auto">
                    <h2 className="text-2xl font-bold mb-6">메신저</h2>
                    <input
                        className="w-full mb-6 px-4 py-2 border rounded text-sm"
                        placeholder="닉네임 검색"
                    />
                    <ul className="space-y-4 text-sm">
                        {chatList.map((chat, idx) => (
                            <li
                                key={idx}
                                className={`p-3 rounded-md cursor-pointer hover:bg-gray-100 ${selectedUser === chat.name ? "bg-gray-100 font-semibold" : ""
                                    }`}
                                onClick={() => setSelectedUser(chat.name)}
                            >
                                <div className="flex justify-between mb-0.5">
                                    <span>{chat.name}</span>
                                    <span className="text-xs text-gray-500">{chat.time}</span>
                                </div>
                                <div className="text-gray-600 text-sm truncate">{chat.message}</div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 채팅창 */}
                <div className="flex-1 flex flex-col bg-[#fcfcfc]">
                    {/* SECTION 1: 상단 - 상대방 정보 */}
                    <div className="px-6 pt-6 pb-2 border-b">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-400 text-white flex items-center justify-center text-sm font-bold">
                                {selectedUser[0]}
                            </div>
                            <div>
                                <div className="text-base font-semibold">{selectedUser}</div>
                                <div className="text-xs text-gray-500">온라인</div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: 메시지 목록 */}
                    <div className="flex-1 px-6 py-4 overflow-y-auto space-y-4">
                        {/* 💬 날짜 표시 */}
                        <div className="text-center text-xs text-gray-400 my-4">2024년 1월 15일</div>

                        {(messages[selectedUser] || []).map((msg) => (
                            <div key={msg.id} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`max-w-[60%] px-4 py-2 rounded-xl text-sm flex flex-col ${msg.isMe
                                        ? "bg-[#3b82f6] text-white items-end"
                                        : "bg-white border border-gray-200 text-black items-start"
                                        }`}
                                >
                                    <span>{msg.text}</span>
                                    <span className={`text-[11px] mt-1 ${msg.isMe ? "text-white/80" : "text-gray-400"}`}>
                                        {msg.time}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* SECTION 3: 입력창 */}
                    <div className="px-6 py-4 border-t">
                        <div className="flex items-center border rounded-full px-4 py-2">
                            <input
                                className="flex-1 text-sm focus:outline-none bg-transparent"
                                placeholder="메시지를 입력..."
                            />
                            <button className="ml-3 bg-purple-600 text-white text-sm px-4 py-1.5 rounded-full">
                                전송
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
