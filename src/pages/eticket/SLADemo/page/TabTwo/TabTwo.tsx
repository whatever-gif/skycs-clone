import Holiday from "./tabs/Holiday/Holiday";
import WorkingTime from "./tabs/WorkingTime/WorkingTime";

const TabTwo = ({ control, setValue, watch }: any) => {
  return (
    <>
      <WorkingTime control={control} watch={watch} setValue={setValue} />
      <Holiday control={control} watch={watch} setValue={setValue} />
    </>
  );
};

export default TabTwo;
