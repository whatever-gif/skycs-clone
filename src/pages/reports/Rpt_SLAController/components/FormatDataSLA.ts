export function calculateSLAStats(data: any) {
  const SLARespondingTotal = data?.reduce(
    (total: any, item: any) => total + item.QtySLAResponding,
    0
  );
  const SLANotRespondingTotal = data?.reduce(
    (total: any, item: any) => total + item.QtySLANotResponding,
    0
  );

  return [
    {
      name: "Tổng SLA đạt yêu cầu",
      QtySLA: SLARespondingTotal,
    },
    {
      name: "Tổng SLA không đạt yêu cầu",
      QtySLA: SLANotRespondingTotal,
    },
  ];
}
