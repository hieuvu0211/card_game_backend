'use client'
import useSWR from 'swr';
import { Card, CardBody, CardFooter, Image} from '@nextui-org/react';
import { useRouter} from 'next/navigation'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import { useState, useEffect } from 'react';
const fetcher = (...args) => fetch(...args).then((res) => res.json());
const fetchData = () => {
    const {data, error} = useSWR('http://localhost:8080/getallskins', fetcher);
    return data;
}

export default function Page() {
    const route = useRouter();
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    // const [data, setData] = useState(null);
    const [page, setPage] = useState(1);
    const [data1, setData1] = useState("");
    const [data2, setData2] = useState("");
    const handleOnPress = (name, price) => {
        setData1(name);
        setData2(price);
        onOpen();
    }
    const handlePageClick = (index) => {
        setPage(index);
    }
    const data = fetchData();
    // useEffect(() => {
    //     fetch('http://localhost:8080/getallskins')
    //     .then(res => res.json())
    //     .then(data => setData(data))
    // })
    if (!data) return <div>Loading...</div>;
    const itemsPerPage = 2;
    const numberOfPages = Math.round(data.length/itemsPerPage);
    const dataPage = data.slice((page-1)*itemsPerPage, itemsPerPage*page);
    console.log(numberOfPages)
    const pagination = Array.from({length: numberOfPages}, (_, index) => {
        if ((index+1)===page) {
            return (
                <button key={index} className=' text-black font-bold px-2 mx-2 my-2 bg-amber-500 rounded-md ' onClick={() => {handlePageClick(index+1)}}>
                {index + 1}
                </button>
            )        
        }
        else {
            return (
                <button key={index} className=' text-black font-bold px-2 mx-2 my-2 bg-zinc-300 rounded-md hover:bg-amber-500 ' onClick={() => {handlePageClick(index+1)}}>
                {index + 1}
                </button>
            )
        }




});
    return (
        <>
        <div className="flex flex-col min-h-screen w-screen ">
        <div className="flex items-center justify-center h-10 bg-white"></div>
        <div className="relative  bg-shop-image bg-cover flex-1">
            <div className=' gap-2 grid grid-cols-4 m-4 mx-8'>
            {dataPage.map((item, index) => (
                <Card key={index} className=' bg-white'> 
                    <CardBody className='overflow-visible' onClick={() => handleOnPress(item.skin_name, item.skin_price)}>
                        <Image 
                        radius='lg'
                        width="100%"
                        className="w-full object-cover h-[300px]"
                        src="https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg"
                        />
                    </CardBody>
                    <CardFooter className='text-small justify-between'>
                        <b>{item.skin_name}</b>
                        <p className=' text-green-500 font-bold'>Giá: {item.skin_price} Coin</p>
                    </CardFooter>
                </Card>
            ))}
            </div>
            <div className='absolute w-full flex items-center justify-center inset-x-0 bottom-0'>
                <div className='flex items-center justify-center w-fit bg-slate-800 rounded-xl mb-2'>
                { pagination }
                </div>
            </div>
        </div>
        </div>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" size="md">
                    <ModalContent>
                        {(onClose) => (
                            <>
                            <ModalHeader className="flex flex-col gap-1 text-black">Mua vật phẩm</ModalHeader>
                            <ModalBody className=" text-black">
                                <p>Tên trang phục: {data1}</p>
                                <p>Giá: {data2}</p>
                            </ModalBody>
                            <ModalFooter>
                            <Button onPress={onClose}>
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