import axios from "axios";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { CardContainer, GlassBox } from "../config/styled-components";
import { IGithubData } from "../config/types/dataTypes";
import Chart, { ChartType } from "chart.js/auto";
import Link from "next/link";
import useWindowSize from "../hooks/useWindowSize";
import SmallLoader from "./small-loader";

type IGithubState = IGithubData[] | null;

const GithubCardContainer = styled(CardContainer)`
  flex: 0.6;
  overflow-x: hidden;
`;
const GithubCard = styled(GlassBox)`
  height: 100%;
  width: 100%;
  padding: ${({ theme }) => theme.space.xl};
  z-index: 1;

  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.lg};
  justify-content: space-between;
  align-items: center;

  & > .title {
    font-size: ${({ theme }) => theme.fontSizes.xxl};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    letter-spacing: 0.15rem;
    text-align: center;
  }

  & > .chart-container {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 100%;

    & > .github-logo-absolute-wrapper {
      position: absolute;
      top: 50%;
      right: 50%;
      transform: translate(50%, -50%);
      height: calc(100% - 4rem);

      z-index: -1;
      opacity: 0.83;

      @media only screen and (max-width: ${({ theme }) =>
          theme.breakpoints.lg}px) {
        opacity: 0.1;
      }

      & > .github-logo-container {
        height: 100%;
        aspect-ratio: 1;
        position: relative;
      }
    }

    & > .chart {
      width: 100%;
      height: 100%;
      position: relative;

      & > canvas {
        max-width: 100%;
        max-height: 100%;
      }
    }

    & > .secondaryContainer {
      & > div {
        font-size: ${({ theme }) => theme.fontSizes.lg};

        &.text {
          font-weight: ${({ theme }) => theme.fontWeights.medium};
          font-size: ${({ theme }) => theme.fontSizes.xl};

          margin-top: ${({ theme }) => theme.space.lg};

          &:first-child {
            margin-top: 0;
          }
        }
      }
    }
  }
`;

const GithubCardComponent: React.FC = () => {
  const [githubData, setGithubData] = useState<IGithubState>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const { width } = useWindowSize();

  const isSmallScreen = width && width < 992;

  const chartContainerRef = useRef<HTMLDivElement>(null);

  const chartJSChartRef = useRef<Chart | null>(null);

  const chartRef = useCallback(
    (chartEl: HTMLCanvasElement) => {
      if (!chartEl) return;

      if (!githubData) return;

      const chartContainerEl = chartContainerRef.current;
      if (!chartContainerEl) return;

      if (chartJSChartRef.current) {
        chartJSChartRef.current.destroy();
      }

      const { width, height } = chartContainerEl.getBoundingClientRect();

      chartEl.height = height;
      chartEl.width = width;

      const ctx = chartEl.getContext("2d");
      if (!ctx) return;

      // Gradient horizontal
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, "rgba(170, 140, 254, 0.7)");
      gradient.addColorStop(1, "rgba(30, 203, 137, 0.7)");

      const gradientBorder = ctx.createLinearGradient(0, 0, width, 0);
      gradientBorder.addColorStop(0, "rgba(170, 140, 254, 0.8)");
      gradientBorder.addColorStop(1, "rgba(30, 203, 137, 0.8)");

      // convert date from YYYY-MM-DD to MM DDD, YYYY

      const labels = githubData
        .map((data) => data.date)
        .map((date) => {
          const dateStr = new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

          return dateStr;
        });
      const data = {
        labels,
        datasets: [
          {
            data: githubData.map((data) => data.numEvents),
            label: "Github Events",
            fill: true,
            backgroundColor: gradient,
            borderColor: gradientBorder,
            pointBackgroundColor: "rgba(189, 195, 199, 0.8)",
            tension: 0.4,
          },
        ],
      };

      let delayed: boolean = false;

      // setting defaults for chartjs
      Chart.defaults.font.size = 16;
      Chart.defaults.plugins.legend.display = false;

      const config = {
        type: "line" as ChartType,
        data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          radius: 5,
          hitRadius: 100,
          hoverRadius: 10,
          scales: {
            yAxes: {
              ticks: {
                color: "#ffffff",
                precision: 0,
              },
              grid: {
                color: "rgba(255, 255, 255, 0.1)",
              },
              precision: 0,
            },
            xAxes: {
              ticks: {
                color: "#ffffff",
              },
              grid: {
                color: "rgba(255, 255, 255, 0.1)",
              },
            },
          },
          animation: {
            onComplete: () => {
              delayed = true;
            },
            delay: (context: any) => {
              let delay = 0;
              if (
                context.type === "data" &&
                context.mode === "default" &&
                !delayed
              ) {
                delay = context.dataIndex * 150 + context.datasetIndex * 100;
              }
              return delay;
            },
          },
        },
      };

      const myChart = new Chart(chartEl, config);
      chartJSChartRef.current = myChart;
    },
    [githubData]
  );

  useEffect(() => {
    const fetchGithubData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get<IGithubData[]>("/api/getgithubstatus");
        setGithubData(data);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    fetchGithubData();
  }, []);

  // get longest streak
  const getLongestStreak = (data: IGithubState) => {
    if (!data) return 0;

    let longestStreak = 0;
    let currentStreak = 0;

    for (let i = 0; i < data.length; i++) {
      if (data[data.length - 1 - i].numEvents > 0) {
        currentStreak++;
      } else {
        currentStreak = 0;
      }

      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
    }

    return longestStreak;
  };

  return (
    <GithubCardContainer className="glassContainer">
      <Link href="https://github.com/theninza" passHref>
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="umami--click--external-github"
        >
          <GithubCard className="glassCard">
            <div className="title">My Github Stats</div>
            {/* chart */}
            <div ref={chartContainerRef} className="chart-container">
              <SmallLoader isLoading={loading} isTransparent={true} />

              <div className="github-logo-absolute-wrapper">
                <div className="github-logo-container">
                  <Image
                    src="/github-icon.svg"
                    alt="Github logo"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              {!isSmallScreen ? (
                <div className="chart">
                  <canvas ref={chartRef} id="git-chart"></canvas>
                </div>
              ) : (
                <div className="secondaryContainer">
                  <div className="text">In Last 10 Days:</div>
                  <div className="text">Github Events:</div>
                  <div>
                    {githubData?.reduce((acc, curr) => acc + curr.numEvents, 0)}
                  </div>
                  <div className="text">Longest Streak:</div>
                  <div>{getLongestStreak(githubData)} days</div>
                </div>
              )}
            </div>
          </GithubCard>
        </a>
      </Link>
    </GithubCardContainer>
  );
};

export default GithubCardComponent;
