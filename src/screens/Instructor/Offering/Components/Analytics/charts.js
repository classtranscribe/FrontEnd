import React from 'react';
import {VictoryLabel, VictoryAxis,VictoryStack, LineSegment,VictoryLine, VictoryTheme, VictoryChart, VictoryBar} from 'victory';


export function BarsChart ({ data }) {
    return (
      <VictoryChart 
        minDomain={{ y: 0 }}
        domainPadding={20}
        height = {300}
        width = {400}
      > 
        <VictoryLabel x={120} y={30}
          text="Time distribution (past week)"
        />
        <VictoryLabel x={0} y={40}
          text="num of students"
        />
        <VictoryLabel x={350} y={265}
          text="hr(s)"
        />
        <VictoryAxis
          name = {"Time(hrs)"}
          dependentAxis
          tickFormat={(x) => (`${x}`)}
        />
        <VictoryAxis
        />
        <VictoryStack
          colorScale={"warm"}
        >
        <VictoryBar 
          data={data}
          style={{
            data: {
              fill: "blue" ,
              fillOpacity: 0.7,
            }
          }}
        // alignment="start"
        />
        </VictoryStack>
        
      </VictoryChart>);
  }
  
export function Chart ({ data }) {
    return (<VictoryChart 
      minDomain={{ y: 0 }}
      theme={VictoryTheme.material}
      > 
      <VictoryLabel x={25} y={30}
        text="(hrs)"
      />
      <VictoryLabel x={135} y={30}
        text="Avg. view time"
      />
      <VictoryLine
        domain={{y: [0, 15]}}
        interpolation="natural"
        style={{
          data: { stroke: "#c43a31", fontSize: "10px" },
          parent: { border: "1px solid #ccc", }
        }}
        data={data}
        padding={{ top: 20, bottom: 60 }}
      />
    </VictoryChart>);
  }

