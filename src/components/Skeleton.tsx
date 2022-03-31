const Skeleton = (props: any) => {
  return (
    <div className=" h-full p-5 w-full mx-auto animate-pulse pb-7 ">
      <div
        className="rounded-md animate-pulse flex bg-gray-200 h-full w-full"
        style={props.small && { height: "10px" }}
      ></div>
    </div>
  );
};
export default Skeleton;
