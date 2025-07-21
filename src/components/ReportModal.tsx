import React, { useState } from "react";
import api from "@/lib/api";

/**
 * 신고 모달 Props
 * - targetId: 신고대상 PK (게시글/댓글)
 * - reportTypeCodeId: 1=게시글, 2=댓글 (커뮤니티/SNS 구분 없이 통합)
 */
interface ReportModalProps {
    open: boolean;
    onClose: () => void;
    targetId: number | null;
    reportTypeCodeId: number; // 1=게시글, 2=댓글
}

const ReportModal: React.FC<ReportModalProps> = ({
                                                     open,
                                                     onClose,
                                                     targetId,
                                                     reportTypeCodeId,
                                                 }) => {
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const handleReport = async () => {
        if (!targetId) {
            alert("신고 대상 정보를 찾을 수 없습니다.");
            return;
        }
        if (!reason.trim()) {
            alert("신고 사유를 입력해주세요.");
            return;
        }
        setLoading(true);
        try {
            await api.post("/report", {
                reportTypeCodeId, // 1(게시글) 또는 2(댓글)
                targetId,
                reason,
            });
            setDone(true);
        } catch (e: any) {
            alert(e?.response?.data?.message || "신고에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 모달 닫을 때 입력값 리셋
    const handleClose = () => {
        setReason("");
        setDone(false);
        onClose();
    };

    if (!open) return null;
    if (done) {
        return (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
                <div className="bg-white rounded-2xl px-8 py-8 shadow-xl text-center">
                    <div className="mb-5 text-xl font-semibold">
                        신고가 정상적으로 접수되었습니다.
                    </div>
                    <button
                        className="mt-2 px-7 py-2 bg-black text-white rounded-xl font-semibold hover:bg-gray-800"
                        onClick={handleClose}
                    >
                        확인
                    </button>
                </div>
            </div>
        );
    }
    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded-2xl px-8 py-8 shadow-xl min-w-[320px]">
                <div className="mb-4 text-lg font-bold text-left">신고하기</div>
                <textarea
                    className="w-full border rounded px-3 py-2 mb-3 text-sm"
                    rows={4}
                    placeholder="신고 사유를 입력하세요"
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    disabled={loading}
                />
                <div className="flex gap-3 mt-4 justify-end">
                    <button
                        className="bg-gray-100 px-5 py-2 rounded-lg text-sm"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        취소
                    </button>
                    <button
                        className="bg-red-500 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-red-600"
                        onClick={handleReport}
                        disabled={loading}
                    >
                        {loading ? "신고 중..." : "신고하기"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;
