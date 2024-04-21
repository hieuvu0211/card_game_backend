'use client'
import Link from "next/link";
import React from "react";
import { useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
export default function Home() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [chat, setChat] = useState("");
  const data=[]
  const handleKeyDown = (e) => {
    if(e.key === "Enter") {
      data.push(chat)
    }
  }
  const handleModal = () => {
    onOpen();
  }
  return (
    <>
    <div className="flex flex-row min-h-screen justify-center items-center">
    <div id="chat" className="flex flex-col fixed left-0 h-full w-96 items-center justify-center pl-2">
      <div className="flex flex-cols  w-full h-56 opacity-75 bg-gray-900 rounded-x-md rounded-t-md">
      </div>
      <input type="text" placeholder="Type here" value={chat} onChange={(e) => setChat(e.currentTarget.value)} onKeyDown={handleKeyDown} className=" w-full bg-slate-700 opacity-75 h-10 pl-2 rounded-x-md rounded-b-md"></input>
    </div>
        <div className=" flex flex-col w-full p-2 m-1 items-center justify-center">
          <div className=" bg-gray-900 hover:bg-slate-300 hover:text-gray-900 shadow-black shadow-md font-bold m-1 w-96 h-14 flex justify-center items-center rounded-3xl">FIND GAME</div>
          <Link className=" bg-gray-900 hover:bg-slate-300 hover:text-gray-900 shadow-black shadow-md font-bold m-1 w-96 h-14 flex justify-center items-center rounded-3xl" href='/create_room'>CREATE ROOM</Link>
          <Link href="/find_room" className=" bg-gray-900 hover:bg-slate-300 hover:text-gray-900 shadow-black shadow-md font-bold m-1 w-96 h-14 flex justify-center items-center rounded-3xl">FIND ROOM</Link>
          <button onClick={() => handleModal()} className=" bg-gray-900 hover:bg-slate-300 hover:text-gray-900 shadow-black shadow-md font-bold m-1 w-96 h-14 flex justify-center items-center rounded-3xl">RULES</button>
        </div>
    </div>

          <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" size="5xl" className=" text-sm">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                <ModalBody className="text-black">
                  <p> 
                  1. Cốt truyện<br></br>
                    Bạn là người đứng đầu một gia đình trong 1 thành phố tại Ý.
                    Thành phố được điều hành bởi 1 hội đồng suy đồi và yếu kém.
                    Bạn cần phải thao túng, lừa gạt và hối lộ để có được quyền lực. 
                    Nhưng bạn không phải là gia đình duy nhất muốn đứng đầu thành phố. 
                    Nhiệm vụ của bạn là phải tiêu diệt tầm ảnh hưởng của tất cả những gia đình khác, ép buộc họ phải lưu vong sang thành phố khác.
                    Sẽ chỉ có 1 gia đình còn tồn tại...
                  </p>
                  <p>
                  2. Luật chơi sơ lược<br></br>
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
  );
}

