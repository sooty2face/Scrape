export interface DailyTrendsDto {
    items: DailyTrendsItemDto[];
}

export interface DailyTrendsItemDto {
    _id: string;
    title: TitleDto | null;
    country: string;
    date: string;
    formattedTraffic: string | null;
    relatedQueries: RelatedQueryDto[];
    image: ImageDto | null;
    articles: ArticleDto[] | null;
    shareUrl: string | null;
    day: number;
}

export interface ArticleDto {
    title: string | null;
    timeAgo: string | null;
    source: string | null;
    image: ImageDto | null;
    url: string | null;
    snippet: string | null;
}

export interface ImageDto {
    newsUrl: string | null;
    source: string | null;
    imageUrl: string | null;
}

export interface RelatedQueryDto {
    queries: RelatedQueriesDto[];
}

export interface TitleDto {
    exploreLink: string | null;
    query: string | null;
}

export interface RelatedQueriesDto {
    queryItem: string | null;
}
