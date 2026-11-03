import { ReactQueryProvider } from "@configs/tanstack";
import RouterComponent from "@routes/index";
import { ToastContainer } from "react-toastify";

const App = () => {
    return (
        <>
            <ReactQueryProvider>
                <ToastContainer
                    position="bottom-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                />

                <RouterComponent />
            </ReactQueryProvider>
        </>
    );
};

export default App;
