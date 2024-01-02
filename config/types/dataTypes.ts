export interface IStack {
  id: string;
  name: string;
  image: {
    url: string;
    fileName: string;
  };
}

export interface IPixWingStack {
  id: string;
  name: string;
  image: {
    url: string;
    fileName: string;
  };
}

export interface IApplication {
  id: string;
  name: string;
  description: string;
  image: {
    url: string;
    fileName: string;
  };
  liveUrl: string;
  sourceCodeUrl: string;
  stacks: IStack[];
}

export interface IAchievement {
  id: string;
  name: string;
  description: string;
  relevantLink: string;
}

export interface IVolunteer {
  id: string;
  name: string;
  description: string;
  relevantLink: string;
}


export interface IResponsibility {
  id: string;
  name: string;
  location: string;
  description: string;
  startDate: string;
  endDate: string;
  isOngoing: boolean;
}

export interface ISpotifyData {
  currentlyPlaying: boolean;
  spotifyData: {
    albumImage: string;
    songName: string;
    artistsNames: string[];
    previewUrl: string;
  };
}

export interface IGithubData {
  numEvents: number;
  date: string;
}

export interface IGithubGraphqlResponse {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          weeks: {
            contributionDays: {
              contributionCount: number;
              date: string;
            }[];
          }[];
        };
      };
    };
  };
}
export interface IVision {
  vId: BigInteger;
  description: string;
  
}
export interface IProduct {
  id: BigInteger;
  description: string;
  productId: string;
}

export interface ICluture{
  id_Culture: BigInteger;
  title: string;
  description: string;
}

export interface ICorprate{
  csrId: BigInteger;
  desc:String;
  title:String;
}