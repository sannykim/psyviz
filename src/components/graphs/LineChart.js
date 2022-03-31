import React from "react";
import { ResponsiveLine } from "@nivo/line";

export default function LineChart({ data, legend, axisLeft = "" }) {
  let al;
  if (axisLeft !== "") {
    al = axisLeft;
  }
  return (
    <>
      <ResponsiveLine
        data={data}
        margin={{ top: 30, right: al ? 60 : 70, bottom: 60, left: 60 }}
        axisBottom={{
          orient: "bottom",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: legend,
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={
          al && {
            legend: al,
            legendOffset: -50,
            legendPosition: "middle",
          }
        }
        colors={(d) => d.color}
        pointSize={7}
        pointBorderWidth={2}
        pointLabelYOffset={-12}
        useMesh={true}
        animate={true}
        curve="cardinal"
        xScale={{
          type: "point",
        }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
        }}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 85,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: "left-to-right",
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "",
          },
        ]}
      />
    </>
  );
}
