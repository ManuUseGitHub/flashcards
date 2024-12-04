import { CardEntry, EffectiveFilters } from "../../ressources/types";
import { evalueateFilter } from "./sorter";

export const hasMatchingArtcicle = (filters: EffectiveFilters, e: CardEntry) => {
    const { article } = filters;

    return evalueateFilter(
      article == '*',
      () =>
        onlyWithoutArticle(article, e) ||
        onlyWithArticle(article, e) ||
        onlyWithDefinedArticle(article, e)
    );
  }
  const onlyWithArticle = (article: string, e: CardEntry) => {
    if (article != '!') return false;
    return /^(het|de)\s.*/i.test(e.dutch) || /^(het|de)/i.test(e.article);
  }
  const onlyWithoutArticle = (article: string, e: CardEntry) => {
    if (article != '/') return false;
    return !(/^(het|de)\s.*/i.test(e.dutch) || /^(het|de)/i.test(e.article));
  }
  const onlyWithDefinedArticle = (article: string, e: CardEntry) => {
    if (!/^(het|de)/.test(article)) return false;
    return (
      new RegExp(`^(${article})\\s.*`, 'i').test(e.dutch) ||
      new RegExp(`^(${article})`, 'i').test(e.article)
    );
  }