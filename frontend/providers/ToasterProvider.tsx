'use client';

import { Toaster } from "react-hot-toast";

const ToasterProvider = () => {
    return (
        <Toaster
            position="bottom-left"
            reverseOrder={false}
        />
    );
}

export default ToasterProvider;