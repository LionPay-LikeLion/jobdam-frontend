import React from "react";
import { FiUser, FiDownload, FiEdit, FiTrash2, FiMessageCircle, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function CommunityBoardPostDetail(): JSX.Element {
  const navigate = useNavigate();

  return (
    <div className="w-full flex justify-center bg-white min-h-screen">
      <div className="w-full max-w-[1000px] px-4 py-10">
        {/* 전체 박스 */}
        <div className="bg-white shadow rounded-xl ring-1 ring-gray-100 px-8 py-10 space-y-8">
          {/* 헤더 */}
          <div className="mb-6 border-b pb-4">
            <h1 className="text-2xl font-semibold">게시글 상세</h1>
          </div>

          {/* 게시글 제목 */}
          <h2 className="text-[32px] font-medium mb-4">React 개발 환경 설정 가이드</h2>

          {/* 작성자 정보 */}
          <div className="flex items-center text-sm text-gray-600 mb-2 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <FiUser className="text-gray-600" />
              </div>
              <span className="text-base text-black font-medium">집가고싶다</span>
            </div>
            <span>2024.01.15 10:30</span>
            <span>조회 247</span>
          </div>

          {/* 카테고리 */}
          <div className="inline-block px-3 py-1 bg-violet-100 text-violet-600 rounded text-sm mb-6">
            자유게시판
          </div>

          {/* 본문 */}
          <div className="space-y-4 text-base text-black leading-6">
            <p>
              안녕하세요! 오늘은 React 개발 환경을 처음부터 설정하는 방법에 대해 자세히 알아보겠습니다.
            </p>
            <p>
              React는 Facebook에서 개발한 JavaScript 라이브러리로, 사용자 인터페이스를 구축하는 데 매우 유용합니다.
              특히 컴포넌트 기반 아키텍처를 통해 재사용 가능한 UI 요소를 만들 수 있어 개발 효율성이 높습니다.
            </p>
            <div className="w-full h-[200px] bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-500">
              이미지: React 개발환경 스크린샷
            </div>
            <div>
              <p>개발 환경 설정 단계:</p>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>Node.js 설치</li>
                <li>Create React App 설치</li>
                <li>프로젝트 생성 및 실행</li>
                <li>개발 도구 설정</li>
              </ul>
            </div>
            <p>
              각 단계별로 자세한 설명과 함께 실제 코드 예제도 포함되어 있으니 차근차근 따라해보시기 바랍니다.
              궁금한 점이 있으시면 언제든 댓글로 문의해주세요!
            </p>
          </div>

          {/* 첨부파일 */}
          <div className="mt-10">
            <h3 className="font-medium mb-2">첨부파일</h3>
            <div className="flex items-center justify-between border rounded-lg p-4 w-full max-w-[1000px]">
              <div className="flex items-start gap-3">
                <FiDownload className="text-gray-500 mt-1" />
                <div>
                  <div className="text-sm font-medium text-black">React_개발환경_가이드.pdf</div>
                  <div className="text-xs text-gray-500">2.3MB</div>
                </div>
              </div>
              <button className="px-4 py-2 bg-violet-600 text-white text-sm rounded-md">다운로드</button>
            </div>
          </div>

          {/* 댓글 */}
          <div className="mt-12 space-y-6">
            <div className="flex items-center gap-2 text-base font-medium">
              <FiMessageCircle />
              <span>댓글 2</span>
            </div>

            {/* 댓글 리스트 */}
            <div className="space-y-4">
              <div className="border rounded-lg p-4 w-full max-w-[1000px]">
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <FiUser className="mr-2" />
                  <span className="text-black font-medium mr-2">김철수</span>
                  <span>2024.01.15 14:30</span>
                </div>
                <div className="text-sm text-black">좋은 정보 감사합니다!</div>
              </div>

              <div className="border rounded-lg p-4 w-full max-w-[1000px]">
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <FiUser className="mr-2" />
                  <span className="text-black font-medium mr-2">이영희</span>
                  <span>2024.01.15 15:45</span>
                </div>
                <div className="text-sm text-black">저도 같은 경험이 있어서 공감됩니다.</div>
              </div>
            </div>

            {/* 댓글 입력창 */}
            <div className="flex items-center gap-3 mt-6 max-w-[1000px]">
              <input
                type="text"
                placeholder="댓글을 입력하세요"
                className="flex-1 px-4 py-2 border rounded-md text-sm"
              />
              <button className="px-4 py-2 bg-black text-white rounded-md text-sm">등록</button>
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="flex justify-between items-center border-t pt-6 mt-12 max-w-[1000px]">
            <div className="flex gap-4">
              <button className="px-4 py-2 border rounded-md text-sm flex items-center gap-1">
                <FiEdit />
                수정
              </button>
              <button className="px-4 py-2 border rounded-md text-sm flex items-center gap-1">
                <FiTrash2 />
                삭제
              </button>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-violet-600 text-white text-sm rounded-md"
            >
              목록으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
