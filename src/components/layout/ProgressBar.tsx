type Props = {
  serumLoadProgress: any;
};

export default function ProgressBar({ serumLoadProgress }: Props) {
  return (
    <>
      {serumLoadProgress.curr && (
        <div className="w-full ">
          <div className="px-7 mb-3 artboard">
            <progress
              className="progress "
            //   progress-secondary
              value={(serumLoadProgress.curr / serumLoadProgress.n) * 100}
              max="100"
            ></progress>
          </div>
        </div>
      )}
    </>
  );
}
