interface Slider {
  TimeStart: number;
  TimeEnd: number;
  Idx: number;
}

export const initWorkingTimeList = Array.from(
  { length: 7 },
  (v: any, k: any) => {
    return {
      Day: k + 1,
      Slider: Array.from({ length: 2 }, (v: any, i: any) => {
        return {
          TimeStart: 0,
          TimeEnd: 0,
          Idx: k * 2 + i + 1,
        };
      }),
      Check: false,
      hasMoreSlide: false,
    };
  }
);
