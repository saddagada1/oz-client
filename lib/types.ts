import { ImageResult } from "expo-image-manipulator";

export type Theme = "light" | "dark";

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  principle: string;
  password: string;
}

export interface UserResponse {
  ID: number;
  Username: string;
  Email: string;
  Verified: boolean;
  TotalProducts: number;
  UpdatedAt: Date;
  CreatedAt: Date;
}

export interface Credentials {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
}

export interface QueuedRequest {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}

export interface ApiError {
  subject: string;
  message: string;
}

export interface VisionHistoryItem {
  key: string;
  image: ImageResult;
  results: EbaySearchResults;
}

//EBAY TYPES

export interface EbaySearchResults {
  autoCorrections: AutoCorrections;
  href: string;
  itemSummaries: ItemSummary[];
  limit: string;
  next: string;
  offset: string;
  prev: string;
  refinement: Refinement;
  total: string;
  warnings: Warning[];
}

export interface AutoCorrections {
  q: string;
}

export interface ItemSummary {
  additionalImages: AdditionalImage[];
  adultOnly: string;
  availableCoupons: string;
  bidCount: string;
  buyingOptions: string[];
  categories: Category[];
  compatibilityMatch: string;
  compatibilityProperties: CompatibilityProperty[];
  condition: string;
  conditionId: string;
  currentBidPrice: CurrentBidPrice;
  distanceFromPickupLocation: DistanceFromPickupLocation;
  energyEfficiencyClass: string;
  epid: string;
  image: Image;
  itemAffiliateWebUrl: string;
  itemCreationDate: string;
  itemEndDate: string;
  itemGroupHref: string;
  itemGroupType: string;
  itemHref: string;
  itemId: string;
  itemLocation: ItemLocation;
  itemWebUrl: string;
  leafCategoryIds: string[];
  legacyItemId: string;
  listingMarketplaceId: string;
  marketingPrice: MarketingPrice;
  pickupOptions: PickupOption[];
  price: Price;
  priceDisplayCondition: string;
  priorityListing: string;
  qualifiedPrograms: string[];
  seller: Seller;
  shippingOptions: ShippingOption[];
  shortDescription: string;
  thumbnailImages: ThumbnailImage[];
  title: string;
  topRatedBuyingExperience: string;
  tyreLabelImageUrl: string;
  unitPrice: UnitPrice;
  unitPricingMeasure: string;
  watchCount: string;
}

export interface AdditionalImage {
  height: string;
  imageUrl: string;
  width: string;
}

export interface Category {
  categoryId: string;
  categoryName: string;
}

export interface CompatibilityProperty {
  localizedName: string;
  name: string;
  value: string;
}

export interface CurrentBidPrice {
  convertedFromCurrency: string;
  convertedFromValue: string;
  currency: string;
  value: string;
}

export interface DistanceFromPickupLocation {
  unitOfMeasure: string;
  value: string;
}

export interface Image {
  height: string;
  imageUrl: string;
  width: string;
}

export interface ItemLocation {
  addressLine1: string;
  addressLine2: string;
  city: string;
  country: string;
  county: string;
  postalCode: string;
  stateOrProvince: string;
}

export interface MarketingPrice {
  discountAmount: DiscountAmount;
  discountPercentage: string;
  originalPrice: OriginalPrice;
  priceTreatment: string;
}

export interface DiscountAmount {
  convertedFromCurrency: string;
  convertedFromValue: string;
  currency: string;
  value: string;
}

export interface OriginalPrice {
  convertedFromCurrency: string;
  convertedFromValue: string;
  currency: string;
  value: string;
}

export interface PickupOption {
  pickupLocationType: string;
}

export interface Price {
  convertedFromCurrency: string;
  convertedFromValue: string;
  currency: string;
  value: string;
}

export interface Seller {
  feedbackPercentage: string;
  feedbackScore: string;
  sellerAccountType: string;
  username: string;
}

export interface ShippingOption {
  guaranteedDelivery: string;
  maxEstimatedDeliveryDate: string;
  minEstimatedDeliveryDate: string;
  shippingCost: ShippingCost;
  shippingCostType: string;
}

export interface ShippingCost {
  convertedFromCurrency: string;
  convertedFromValue: string;
  currency: string;
  value: string;
}

export interface ThumbnailImage {
  height: string;
  imageUrl: string;
  width: string;
}

export interface UnitPrice {
  convertedFromCurrency: string;
  convertedFromValue: string;
  currency: string;
  value: string;
}

export interface Refinement {
  aspectDistributions: AspectDistribution[];
  buyingOptionDistributions: BuyingOptionDistribution[];
  categoryDistributions: CategoryDistribution[];
  conditionDistributions: ConditionDistribution[];
  dominantCategoryId: string;
}

export interface AspectDistribution {
  aspectValueDistributions: AspectValueDistribution[];
  localizedAspectName: string;
}

export interface AspectValueDistribution {
  localizedAspectValue: string;
  matchCount: string;
  refinementHref: string;
}

export interface BuyingOptionDistribution {
  buyingOption: string;
  matchCount: string;
  refinementHref: string;
}

export interface CategoryDistribution {
  categoryId: string;
  categoryName: string;
  matchCount: string;
  refinementHref: string;
}

export interface ConditionDistribution {
  condition: string;
  conditionId: string;
  matchCount: string;
  refinementHref: string;
}

export interface Warning {
  category: string;
  domain: string;
  errorId: string;
  inputRefIds: string[];
  longMessage: string;
  message: string;
  outputRefIds: string[];
  parameters: Parameter[];
  subdomain: string;
}

export interface Parameter {
  name: string;
  value: string;
}
