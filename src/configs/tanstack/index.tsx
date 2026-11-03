import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";

// Khởi tạo một QueryClient instance với các cấu hình mặc định tối ưu
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Dữ liệu sẽ được coi là "cũ" (stale) sau 5 phút.
            staleTime: 1000 * 60 * 5, // 5 minutes

            // Dữ liệu không hoạt động (inactive) sẽ bị xóa khỏi cache sau 30 phút.
            gcTime: 1000 * 60 * 30, // 30 minutes

            // Tắt việc tự động fetch lại khi cửa sổ trình duyệt được focus.
            refetchOnWindowFocus: false,

            // Tắt việc fetch lại khi component mount lần đầu nếu data đã có.
            refetchOnMount: false,

            // Khi một query bị lỗi, nó sẽ thử lại 1 lần.
            retry: 1,
        },
    },
});

/**
 * Component Provider cho React Query.
 * Bọc toàn bộ ứng dụng của bạn bằng component này để sử dụng React Query.
 */
export const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        // Sửa ở đây: Sử dụng component QueryClientProvider
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};
