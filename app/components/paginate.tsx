"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function Paginate({ page, total }: { page: number; total: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const maxPage = Math.ceil(total / 25);
  const pagesToShow = 5;

  const getPageNumbers = () => {
    let start = Math.max(1, page - Math.floor(pagesToShow / 2));
    let end = Math.min(maxPage, start + pagesToShow - 1);

    if (end - start < pagesToShow - 1) {
      start = Math.max(1, end - pagesToShow + 1);
    }

    let pageNumbers = [];
    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const goToPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", p.toString());
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="flex gap-2 w-full justify-center items-center">
      <button disabled={page === 1} className="disabled:text-gray-500 text-purple-700 disabled:cursor-not-allowed" onClick={() => goToPage(1)}>
        {"<<"}
      </button>
      <button disabled={page === 1} className="disabled:text-gray-500 text-purple-700 disabled:cursor-not-allowed" onClick={() => goToPage(page - 1)}>
        {"<"}
      </button>
      {getPageNumbers().map((p) => (
        <button key={p} className={`px-2 py-1 rounded ${p === page ? "bg-purple-700 text-white" : "bg-gray-700"}`} onClick={() => goToPage(p)}>
          {p}
        </button>
      ))}
      <button disabled={page === maxPage} className="disabled:text-gray-500 text-purple-700 disabled:cursor-not-allowed" onClick={() => goToPage(page + 1)}>
        {">"}
      </button>
      <button disabled={page === maxPage} className="disabled:text-gray-500 text-purple-700 disabled:cursor-not-allowed" onClick={() => goToPage(maxPage)}>
        {">>"}
      </button>
    </div>
  );
}
