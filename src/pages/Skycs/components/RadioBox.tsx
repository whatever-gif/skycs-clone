const RadioBox = (data: any) => {
  const handleAddButtonClick = () => {
    
  }

  if (data.id === "add") {
    return <button onClick={handleAddButtonClick}>Add</button>;
  }

  return (
    <div>
      <span>{data.name}</span>
      <span> - ID: {data.id}</span>
    </div>
  );
};

export default RadioBox;
