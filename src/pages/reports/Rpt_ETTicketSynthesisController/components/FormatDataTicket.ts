export function groupTicketsByDate(input: any, listStatus: any[]) {
  const output: any = [];
  const dateMap = new Map();

  const defaultObject: any = {};

  const listStatusShorted = Array.isArray(listStatus)
    ? listStatus?.map((item: any) => {
        defaultObject[item?.TicketStatus] = 0;
        return item?.AgentTicketStatusName;
      })
    : [];

  input?.forEach((ticket: any) => {
    const createDate = ticket.CreateDate.split("T")[0];

    if (!dateMap.has(createDate)) {
      dateMap.set(createDate, { ...defaultObject });
    }

    dateMap.get(createDate)[ticket.TicketStatus] += ticket.QtyTicket;
  });

  dateMap?.forEach((value, createDate) => {
    output.push({
      CreateDate: createDate,
      ...value,
    });
  });

  console.log(output);

  return output;
}

export const architectureSources = [
  { value: "New", name: "New", color: "#0FBC2B" },
  { value: "Open", name: "Open", color: "#CFB929" },
  { value: "Processing", name: "Processing", color: "#E48203" },
  { value: "Closed", name: "Closed", color: "#A7A7A7" },
  { value: "Resolved", name: "Resolved", color: "#298EF2" },
];
