'use client'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react"
import React from "react";
import { useEffect } from "react";
export default function itemModal({name, price}) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    useEffect(() => {
        onOpen();
    }, [])
    const handleBuyItem = (nameItem) => {
        console.log("ok, buy ", nameItem)
        alert("ok, buy ", nameItem)
    }
    return(
        <>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" size="md">
        <ModalContent>
            {(onClose) => (
                <>
                <ModalHeader className="flex flex-col gap-1 text-black">Mua vật phẩm</ModalHeader>
                <ModalBody className=" text-black">
                    <p>Tên trang phục: {name}</p>
                    <p>Giá: {price}</p>
                    <h1 onClick={() => handleBuyItem(name)}>BUY</h1>
                </ModalBody>
                <button onClick={() => handleBuyItem(name)}>BUY</button>
                <ModalFooter>
                <Button onPress={() => handleBuyItem(name)}>
                    Xác nhận mua hàng
                </Button>
                <Button onPress={onClose}>
                    Đóng
                </Button>
                </ModalFooter>
                </>
            )}
        </ModalContent>
    </Modal>
    </>
    )

}