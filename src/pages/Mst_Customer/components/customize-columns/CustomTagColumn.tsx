const CustomTagColumn = ({ list, display, object }: any) => {
  return (
    <>
      {list?.length > 0 && (
        <div className="flex gap-1">
          {list?.map((item: any) => {
            return (
              <div className="bg-[#EAF9F2] p-[5px] rounded-[5px] font-semibold">
                {item[object][0][display]}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default CustomTagColumn;
