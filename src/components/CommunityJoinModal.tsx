import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import api from "@/lib/api";
import { toast } from "sonner";

interface CommunityJoinModalProps {
  open: boolean;
  onClose: () => void;
  joinPoint: number; // 커뮤니티 가입 포인트(생성자가 설정)
  userPoint: number; // 내 포인트(필요시 외부에서 전달, 기본값 유지)
}


export default function CommunityJoinModal({ open, onClose, joinPoint, userPoint }: CommunityJoinModalProps) {
  const [showComplete, setShowComplete] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id } = useParams<{ id: string }>();

  const handleJoin = () => {
    setShowConfirm(true);
  };

  const handleConfirmJoin = async () => {
    try {
      setLoading(true);
      console.log('Joining community:', id);
      const response = await api.post(`/communities/${id}/join`);
      console.log('Join response:', response.data);
      toast.success("커뮤니티에 가입되었습니다!");
      setShowConfirm(false);
      setShowComplete(true);
    } catch (error: any) {
      console.error("커뮤니티 가입 실패:", error);
      const errorMessage = error.response?.data || "커뮤니티 가입에 실패했습니다.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelJoin = () => {
    setShowConfirm(false);
  };

  const handleCompleteClose = () => {
    setShowComplete(false);
    onClose();
    // 페이지 새로고침하여 멤버 상태 업데이트
    window.location.reload();
  };

  return (
    <>
      {/* 가입 모달 */}
      <Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
        <DialogContent className="max-w-[380px] p-0 rounded-xl overflow-hidden">
          <DialogHeader className="p-5 border-b">
            <DialogTitle className="text-lg font-bold">커뮤니티 가입</DialogTitle>
          </DialogHeader>
          <div className="p-6 flex flex-col items-center">
            <img src="/images/logo.png" alt="커뮤니티 가입" className="w-28 h-24 mb-4" />
            <div className="w-full bg-gray-50 rounded-lg p-3 mb-6">
              <div className="text-xs text-gray-500 mb-1">가입 포인트</div>
              <div className="text-2xl font-bold text-pink-600">{joinPoint.toLocaleString()}P</div>
            </div>
            <div className="w-full flex justify-between items-center mb-6">
              <span className="text-gray-500 text-sm">내 플레이포인트</span>
              <span className="text-gray-800 font-bold">{userPoint.toLocaleString()}P</span>
            </div>
            <Button 
              className="w-full h-12 rounded-full text-lg font-bold bg-gray-800 text-white hover:bg-gray-700" 
              onClick={handleJoin}
              disabled={loading}
            >
              {loading ? "처리 중..." : "가입하기"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* 가입 확인 모달 */}
      <Dialog open={showConfirm} onOpenChange={v => { if (!v) handleCancelJoin(); }}>
        <DialogContent className="max-w-[320px] p-0 rounded-xl overflow-hidden">
          <div className="p-6 pb-0">
            <div className="text-lg font-bold text-center mb-4">정말 가입하시겠습니까?</div>
          </div>
          <div className="flex flex-row gap-3 justify-center p-6 pt-0">
            <Button 
              variant="outline" 
              className="w-24 h-11 rounded-full text-base font-bold" 
              onClick={handleCancelJoin}
              disabled={loading}
            >
              취소
            </Button>
            <Button 
              className="w-24 h-11 rounded-full text-base font-bold bg-gray-800 text-white hover:bg-gray-700" 
              onClick={handleConfirmJoin}
              disabled={loading}
            >
              {loading ? "처리 중..." : "확인"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* 가입 완료 모달 */}
      <Dialog open={showComplete} onOpenChange={v => { if (!v) handleCompleteClose(); }}>
        <DialogContent className="max-w-[320px] p-0 rounded-xl overflow-hidden">
          <div className="p-6 pb-0">
            <div className="text-xl font-bold text-center mb-4">가입이 완료되었습니다</div>
          </div>
          <div className="flex flex-col items-center p-6 pt-0">
            <img src="/images/logo.png" alt="완료" className="w-20 h-16 mb-4" />
            <Button className="w-full h-11 rounded-full text-base font-bold bg-gray-800 text-white hover:bg-gray-700 mt-2" onClick={handleCompleteClose}>확인</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 