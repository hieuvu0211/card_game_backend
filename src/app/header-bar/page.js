'use client'
import { useCookies } from 'react-cookie'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import { useEffect, useState } from 'react';
export default function HeaderBar() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies(['login'])
  const [isUserLogin, setUserLogin] = useState(null)
  const handleLogin = () => {
    removeCookie('login', { path: '/'})
    localStorage.removeItem("username");
    localStorage.removeItem("id");
    localStorage.removeItem("idSkin");
    localStorage.removeItem("cost");
    window.location.reload();
  }
  useEffect(() => {
    const isLogin = localStorage.getItem("username");
    if(isLogin != null) {
      setUserLogin(isLogin);
    }
    console.log("isLogin = ", isUserLogin)
  },[])
  const openTips = () => {
    onOpen();
  }
    return (
      <>
        <div className=" bg-black text-white flex flex-row w-full fixed top-0 z-50">
        <div className="flex flex-row bg-slate-800 basis-1/2">
          <Link className="flex flex-row rounded-3xl m-2 text-center w-40" href='/'><img src="/img/icon.ico" className='w-6 h-6 mr-2'/> Coup(2012)</Link>
        </div>
          <div className="flex flex-row bg-slate-800 basis-1/2  justify-end">
          <button onClick={() => openTips()} className="  m-2 w-16 text-center hover:bg-gray-600 rounded-3xl">Tips</button>
            <div className="  m-2 w-16 text-center hover:bg-gray-600 rounded-3xl"><Link href="/shop">Shop</Link></div>
            <div className="  m-2 w-20 text-center hover:bg-gray-600 rounded-3xl">
              {cookies['login']? <button onClick={handleLogin}>Sign out</button>: <Link href='/login'>Sign in</Link>}
              </div>
              {isUserLogin == null ? 
              <div className="  m-2 w-20 text-center hover:bg-gray-600 rounded-3xl"><Link href="/register">Register</Link></div>
              : <div className="  m-2 w-50 text-center hover:bg-gray-600 rounded-3xl"><Link href="/account">My Account</Link></div>}
            
          </div>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" size="5xl" className=" text-sm">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                <ModalBody className="text-black">

                  <p>
                  Luật chơi sơ lược<br></br>
                    - Mỗi người chơi có 2 thẻ nhân vật úp mặt trong khu vực chơi của mình và được chia 2 đồng tiền
                    <br></br>
                    - Bộ bài nhân vật bao gồm 5 nhân vật khác nhau, mỗi nhân vật có 3 lá với sức mạnh khác nhau:
                    <br></br>
                      Duke: Lấy ba đồng xu từ kho bạc. Chặn ai đó lấy viện trợ nước ngoài.
                      <br></br>
                      Sát thủ: Trả ba đồng xu và cố gắng ám sát nhân vật của người chơi khác.
                      <br></br>
                      Contessa: Chặn một vụ ám sát chống lại chính bạn.
                      <br></br>
                      Captain: Lấy hai đồng xu từ người chơi khác hoặc chặn ai đó ăn cắp tiền của bạn.
                      <br></br>
                      Ambassador: Rút hai thẻ nhân vật từ Tòa án (bộ bài), chọn thẻ nào (nếu có) để trao đổi với các nhân vật úp mặt của bạn, sau đó trả lại hai. Chặn ai đó ăn cắp tiền từ bạn.
                      <br></br>
                    - Đến lượt bạn, bạn có thể thực hiện bất kỳ hành động nào được liệt kê ở trên, bất kể bạn thực sự có nhân vật nào trước mặt hoặc bạn có thể thực hiện một trong ba hành động khác:
                      <br></br>
                      Thu nhập: Lấy một xu từ kho bạc.
                      <br></br>
                      Viện trợ nước ngoài: Lấy hai đồng tiền từ kho bạc.
                      <br></br>
                      Cuộc đảo chính: Trả bảy đồng xu và khởi động một cuộc đảo chính chống lại một đối thủ, buộc người chơi đó mất một ảnh hưởng. (Nếu bạn có mười xu trở lên, bạn phải thực hiện hành động này.)
                      <br></br>                    
                    - Khi bạn thực hiện một trong các hành động của nhân vật - dù chủ động đến lượt mình, hoặc phòng thủ để phản ứng với hành động của người khác - hành động của nhân vật đó sẽ tự động thành công trừ khi đối thủ thách thức bạn. 
                      <br></br>
                    - Trong trường hợp bạn bị thách thức, nếu bạn không thể (hoặc không) tiết lộ nhân vật phù hợp, bạn sẽ mất ảnh hưởng, biến một trong những nhân vật của bạn ngửa mặt lên. Không thể sử dụng các ký tự ngửa mặt và nếu cả hai nhân vật của bạn đều ngửa mặt, bạn sẽ ra khỏi trò chơi. Nếu bạn có nhân vật trong câu hỏi và chọn tiết lộ nó, đối thủ sẽ mất một ảnh hưởng, sau đó bạn đưa nhân vật đó vào bộ bài và vẽ một nhân vật mới, có thể nhận lại cùng một nhân vật và có lẽ không.
                      <br></br>
                    - Người chơi cuối cùng vẫn có nhân vật úp sẽ chiến thắng trò chơi.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="secondary" className=" text-md font-bold" onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
    </>
    )
}