import React from "react";
import { ResponsivePie } from "@nivo/pie";

const PieChart = ({ data }) => (
  <ResponsivePie
    data={[
      {
        id: "calls",
        label: "calls",
        value: data[0],
        color: "hsl(197, 99%, 70%)", //"hsl(65, 70%, 50%)",
      },
      {
        id: "puts",
        label: "puts",
        value: data[1],
        color: "#ec4899", // "hsl(199, 70%, 50%)",
      },
    ]}
    margin={{
      top: 40,
      right: 80,
      bottom: 80,
      left: 80,
    }}
    innerRadius={0.5}
    padAngle={0.7}
    cornerRadius={3}
    colors={{
      scheme: "nivo",
    }}
    borderWidth={1}
    borderColor={{
      from: "color",
      // modifiers: [["darker", 0.2]],
    }}
    radialLabelsSkipAngle={10}
    radialLabelsTextXOffset={6}
    radialLabelsTextColor="#333333"
    radialLabelsLinkOffset={0}
    radialLabelsLinkDiagonalLength={16}
    radialLabelsLinkHorizontalLength={24}
    radialLabelsLinkStrokeWidth={1}
    radialLabelsLinkColor={{
      from: "color",
    }}
    slicesLabelsSkipAngle={10}
    slicesLabelsTextColor="#333333"
    animate={true}
    motionStiffness={90}
    motionDamping={15}
    legends={[
      {
        anchor: "bottom",
        direction: "row",
        translateY: 56,
        itemWidth: 100,
        itemHeight: 18,
        itemTextColor: "#999",
        symbolSize: 18,
        symbolShape: "circle",
        effects: [
          {
            on: "hover",
            style: {
              itemTextColor: "#000",
            },
          },
        ],
      },
    ]}
  />
);
export default PieChart;
