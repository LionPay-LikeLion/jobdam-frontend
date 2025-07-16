// src/pages/Community.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Community = () => {
  return (
    <div className="min-h-screen bg-background font-korean p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">커뮤니티 게시판</h1>

      <Card>
        <CardContent className="p-4">
          <p className="text-gray-500">백엔드 API 연결 예정. 게시글 목록이 여기에 표시됩니다.</p>
        </CardContent>
      </Card>

      <Button variant="default">게시글 작성</Button>
    </div>
  );
};

export default Community;
