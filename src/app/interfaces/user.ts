export default interface User {
  userName: string;
  firstName: string;
  lastName: string;
  stats: {
    totalBeers: number;
  };
  recent_brews: any[];
}
