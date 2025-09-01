import * as Dialog from "@radix-ui/react-dialog";
import { FiX } from "react-icons/fi";

export default function Modal({ open, onOpenChange, title, subTitle, children }) {
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/20 backdrop-md z-40" />
                <Dialog.Content className="fixed top-[5%] left-1/2 z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto -translate-x-1/2 rounded-md bg-white shadow-2xl border border-gray-200 focus:outline-none">
                    <div className="flex justify-between items-start px-6 py-4">
                        <div>
                        <Dialog.Title className="text-xl !text-xl font-semibold text-gray-900">
                                {title}
                            </Dialog.Title>
                            {subTitle && (
                                <p className="text-sm text-gray-500 mt-1">{subTitle}</p>
                            )}
                        </div>
                        <Dialog.Close asChild>
                            <button className="text-gray-500 bg-transparent hover:bg-gray-100 rounded p-1 transition">
                                <FiX size={20} />
                            </button>
                        </Dialog.Close>
                    </div>


                    <div className="px-6">{children}</div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
