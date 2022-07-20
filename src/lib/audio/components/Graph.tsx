import React from 'react';
import { AudioComponentDefinition, AudioComponentProps } from './AudioComponentDefinition';
import { LineChart, CartesianGrid, Line, YAxis } from 'recharts';

export const GraphDefinition: AudioComponentDefinition<AnalyserNode, void> = {
  component: Graph,
  initializeMutableState: ({ globalAudioContext }) => new AnalyserNode(globalAudioContext),
  initialSerializableState: undefined,
  inPlugs: {
    'Input': {
      type: 'audio',
      getParameter: filterNode => filterNode,
    },
  },
  outPlugs: {
    'Output': {
      type: 'audio',
      getParameter: filterNode => filterNode,
    }
  },
  color: 'lightpink',
};

export type GraphProps = AudioComponentProps<AnalyserNode, void>;

export function Graph({ mutableState: analyserNode }: GraphProps) {
    const animationRef = React.useRef<number>();
    const [data, setData] = React.useState<Uint8Array>();

    const animate = () => {

        const bufferLength = analyserNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserNode.getByteTimeDomainData(dataArray);

        setData(dataArray);

        animationRef.current = window.requestAnimationFrame(animate);
    };

    React.useEffect(() => {
        animationRef.current = window.requestAnimationFrame(animate);
        return () => {
            animationRef.current && window.cancelAnimationFrame(animationRef.current);
        };
    }, []);

    const mappedData = data ? Array.from(data).map(datum => ({value: (datum - 128) / 256})) : [];

    return (
        <>{data && <LineChart width={400} height={200} data={mappedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <YAxis domain={[-1, 1]} />
            <Line type="monotone" dataKey="value" stroke="green" strokeWidth={2} />
        </LineChart>}</>
    );
}

