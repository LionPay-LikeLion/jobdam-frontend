import { Button } from "@/components/ui/button";
import TopBar from "@/components/TopBar";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentSuccess() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col bg-white font-korean">
            {/* 상단 네비게이션 */}
            <TopBar />

            {/* 본문 */}
            <main className="flex-1 flex justify-center items-start py-24 bg-white">
                <div className="w-[900px] px-10 py-12 shadow-md border rounded-xl bg-white relative flex flex-col items-center">
                    <h1 className="text-4xl font-bold text-black mb-2 text-center">
                        결제가 정상적으로 완료되었습니다!
                    </h1>
                    <p className="text-base text-black mb-10 text-center">
                        포인트 충전이 완료되었습니다.<br/>
                        이용해 주셔서 감사합니다.
                    </p>

                    {/* 안내 카드 */}
                    <Card className="w-full max-w-[480px] h-[120px] mb-8 bg-[#00000005] rounded-lg flex items-center">
                        <CardContent className="p-5 w-full flex flex-col items-center">
              <span className="text-lg font-semibold text-[#2f80ed] mb-2">
                🎉 결제가 완료되었습니다.
              </span>
                            <span className="text-base text-black">
                <b>마이페이지</b>에서 충전 내역을 확인하실 수 있습니다.
              </span>
                        </CardContent>
                    </Card>

                    <Button
                        className="w-full h-14 mt-2 bg-[#0000001a] text-[#000000b2] rounded-lg font-medium text-base text-center"
                        onClick={() => navigate("/mypage")}
                    >
                        마이페이지로 이동
                    </Button>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-50 py-6 text-center text-sm text-gray-500">
                © 2025 돈내고사자 팀. All rights reserved.
            </footer>
        </div>
    );
}
