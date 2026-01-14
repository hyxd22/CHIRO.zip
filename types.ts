
export interface CreativeDirection {
  title: string;
  description: string;
}

export interface DesignProcessStep {
  title: string;
  description: string;
}

export interface CapabilityItem {
  title: string;
  description: string;
}

export interface WorkItem {
  id: string;
  brand: string;
  logo?: string; 
  company: string;
  category: string;
  oneLiner: string;
  thumbnail: string;
  role: string;
  media: string[];
  creativeDirections: CreativeDirection[];
  visuals: string[];
}

export interface SidebarMenu {
  main: string;
  about: string;
  capability: string;
  contact: string;
}

export interface TypographyStyle {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  fontWeight: number;
  color: string;
}

export interface SiteInfo {
  galleryUrls?: string[];
  heroHeadline: string;
  heroHeadlineStyle: TypographyStyle;
  heroSubheadline: string;
  heroSubheadlineStyle: TypographyStyle;
  mainIntroText: string;
  mainIntroTextStyle: TypographyStyle;
  designProcessTitle: string;
  designProcessTitleStyle: TypographyStyle;
  designProcessSteps: DesignProcessStep[];
  designProcessStepTitleStyle: TypographyStyle;
  designProcessStepDescriptionStyle: TypographyStyle;
  worksGalleryTitle: string;
  worksGalleryTitleStyle: TypographyStyle;
  capabilitiesTitle: string;
  capabilitiesTitleStyle: TypographyStyle;
  capabilities: CapabilityItem[];
  capabilityItemTitleStyle: TypographyStyle;
  capabilityItemDescriptionStyle: TypographyStyle;
  aboutIntro: string;
  aboutIntroStyle: TypographyStyle;
  aboutPerspectiveLabel: string;
  aboutDesignCriteria: string;
  aboutWorkingStyleLabel: string;
  aboutWorkingStyle: string;
  aboutExperienceLabel: string;
  aboutExperience: string;
  aboutClosing: string;
  aboutClosingStyle: TypographyStyle;
  aboutSectionSpacing: number;
  bodyTextStyle: TypographyStyle;
  pointColor: string;
  workTitleStyle: TypographyStyle;
  sidebarStyle: TypographyStyle;
  sectionHeadingStyle: TypographyStyle;
  cardTitleStyle: TypographyStyle;
  contactHeadline: string;
  contactHeadlineStyle: TypographyStyle;
  contactSubheadline: string;
  contactSubheadlineStyle: TypographyStyle;
  workMetadataLabelStyle: TypographyStyle;
  workMetadataValueStyle: TypographyStyle;
  workOneLinerStyle: TypographyStyle;
  workDetailHeaderBrandStyle: TypographyStyle;
  workDetailHeaderTitleStyle: TypographyStyle;
  workDetailHeaderBulletStyle: TypographyStyle;
  workDetailTabStyle: TypographyStyle;
}

export enum Page {
  MAIN = 'main',
  ABOUT = 'about',
  WORK_DETAIL = 'work_detail',
  CAPABILITY = 'capability',
  CONTACT = 'contact',
  ADMIN = 'admin'
}
