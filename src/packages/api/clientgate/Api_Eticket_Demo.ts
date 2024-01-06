import { ApiResponse, Eticket } from "@packages/types";
import { Size } from "devextreme-react/bar-gauge";
import { atom, useAtom, useAtomValue } from "jotai";

const eticket0: Eticket = {
  Id: "123456",
  Name: "Eticket demo",
  Status: "Processing",
  Type: "Ticket hỗ trợ",
  PreferredReplyChannel: "Zalo",
  UpdateDtime: "2023-06-10 9:00",
  Deadline: "2023-06-20 9:00",
  Agent: "Nguyen Van Huong",
  Tags: "Zalo, Hỗ trợ, Tag3",
  Customer: {
    Email: "customer1@gmail.com",
    Image: null,
    Name: "Khach Hang 01",
    Phone: "091234567",
  },
  MessageList: [
    {
      AuthorImage: null,
      AuthorName: "Nguyen Van B",
      Type: "Email",
      IsPinned: false,
      CreateDtime: "2023-06-20 9:00",
      Detail: null,
      Attachments: [
        {
          Url: "/contest/abcdfdasdsad.rar",
          Name: "Test gui file.rar",
          Size: 1024,
        },
      ],
      Email: {
        Type: "Out",
        From: "Support@idocnet.com",
        To: "huongng@idocnet.com",
        Subject: "Tieu de email 1",
        Detail:
          "Siêu vật liệu mới cấu tạo từ mạng lưới polymer auxetic gia cố bên trong ma trận xi măng dẫn điện. Xi măng dẫn điện được củng cố bằng bột graphite, tạo thành điện cực. Một kích thích cơ học có thể dẫn tới điện khí hóa giữa các lớp. Bê tông do nhóm nghiên cứu của Amir Alavi, trợ lý giáo sư ngành kỹ thuật dân dụng và môi trường ở Pitt tạo ra không thể sản xuất đủ năng lượng để đưa vào lưới điện, nhưng có thể dùng để theo dõi thiệt hại bên trong công trình bê tông, ví dụ trong trường hợp động đất. Họ công bố kết quả nghiên cứu trên tạp chí Advanced Materials, New Atlas hôm 22/3 đưa tin.",
      }
    },
    {
      AuthorImage: null,
      AuthorName: "Nguyen Van B",
      Type: "Email",
      IsPinned: false,
      CreateDtime: "2023-06-20 9:00",
      Detail: null,
      Attachments: [
        {
          Url: "/contest/abcdfdasdsad.rar",
          Name: "Test gui file.rar",
          Size: 1024,
        },
      ],
      Email: {
        Type: "In",

        From: "huongng@idocnet.com",
        To: "Support@idocnet.com",
        Subject: "Tieu de email 1",
        Detail: "Ok boy",
      }
    },
    {
      AuthorImage: null,
      AuthorName: "Nguyen Van B",
      Type: "Note",
      IsPinned: true,
      CreateDtime: "2023-06-20 9:00",
      Detail: null,
      Attachments: [
        {
          Url: "/contest/abcdfdasdsad.rar",
          Name: "Test gui file.rar",
          Size: 1024,
        },
      ]
    },
    {
      AuthorImage: null,
      AuthorName: null,
      Type: "Event",
      IsPinned: false,
      CreateDtime: "2023-06-20 9:00",
      Detail: "Nguyen Van Huong da chuyen trang thai eticket...",
    },
    {
      AuthorImage: null,
      AuthorName: "Nguyen Van B",
      Type: "Call",
      IsPinned: false,
      CreateDtime: "2023-06-20 9:00",
      Detail: null,
      Call: {
        FromNumber: "0981234567",
        ToNumber: "19000000",
        Type: "In",
      }
    },
    {
      AuthorImage: null,
      AuthorName: "Nguyen Van B",
      Type: "Note",
      IsPinned: false,
      CreateDtime: "2023-06-20 9:00",
      Detail: "GHi chu",
    },
    {
      AuthorImage: null,
      AuthorName: "Nguyen Van B",
      Type: "Call",
      IsPinned: false,
      CreateDtime: "2023-06-20 9:00",
      Detail: null,
      Call: {
        FromNumber: "0981234567",
        ToNumber: "19000000",
        Type: "Missed",
      }
    },
  ],
};

export const useEticket_api = () => {
  // /const eticketAtom = atom<Eticket>(eticket0);
  //var atomVal = useAtomValue(eticketAtom);
  return {
    getDemoEticket: () => {
      //return atomVal;
      return eticket0;
    },
  };
};
