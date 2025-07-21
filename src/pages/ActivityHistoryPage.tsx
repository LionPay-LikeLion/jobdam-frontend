// src/pages/ActivityHistoryPage.tsx
import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import MyPageLayout from "./MyPageLayout";
import { Button } from "@/components/ui/button";

type TabType = "SNS_POST" | "SNS_COMMENT";

export default function ActivityHistoryPage() {
  const [tab, setTab] = useState<TabType>("SNS_POST");
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let fetch;
    if (tab === "SNS_POST") {
      fetch = api.get("/sns/posts/my");
    } else {
      fetch = api.get("/sns/comments/my");
    }
    fetch.then(res => setList(res.data)).finally(() => setLoading(false));
  }, [tab]);

  function formatDate(iso: string) {
    if (!iso) return "-";
    const d = new Date(iso);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }
  function pad(n: number) { return n < 10 ? "0" + n : n; }

  return (
    <MyPageLayout>
      <Card className="shadow-[0px_2px_8px_#00000014]">
        <CardContent className="p-8">
          <h2 className="font-medium text-black text-[28px] mb-8">활동 내역</h2>
          <div className="flex gap-2 mb-8">
            <Button variant={tab === "SNS_POST" ? "default" : "outline"} onClick={() => setTab("SNS_POST")}>SNS 게시글</Button>
            <Button variant={tab === "SNS_COMMENT" ? "default" : "outline"} onClick={() => setTab("SNS_COMMENT")}>SNS 댓글</Button>
          </div>
          {loading ? (
            <div>로딩중...</div>
          ) : (
            <div className="overflow-x-auto">
              {tab === "SNS_POST" && (
                <table className="min-w-full border rounded-xl text-center">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-3 px-4">작성일</th>
                      <th className="py-3 px-4">제목</th>
                      <th className="py-3 px-4">좋아요</th>
                      <th className="py-3 px-4">댓글</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-gray-400 py-10">내역 없음</td>
                      </tr>
                    ) : (
                      list.map((item: any) => (
                        <tr key={item.snsPostId}>
                          <td className="py-3 px-4">{formatDate(item.createdAt)}</td>
                          <td className="py-3 px-4">{item.title}</td>
                          <td className="py-3 px-4">{item.likeCount}</td>
                          <td className="py-3 px-4">{item.commentCount}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
              {tab === "SNS_COMMENT" && (
                <table className="min-w-full border rounded-xl text-center">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-3 px-4">작성일</th>
                      <th className="py-3 px-4">내용</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="text-gray-400 py-10">내역 없음</td>
                      </tr>
                    ) : (
                      list.map((item: any) => (
                        <tr key={item.commentId}>
                          <td className="py-3 px-4">{formatDate(item.createdAt)}</td>
                          <td className="py-3 px-4">{item.content}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </MyPageLayout>
  );
}
