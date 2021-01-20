import Beer from './beer';

export default interface ActionBarItem {
  value: string;
  icon: string;
  beer: Beer;
  tooltipText: string;
  link: string;
}
