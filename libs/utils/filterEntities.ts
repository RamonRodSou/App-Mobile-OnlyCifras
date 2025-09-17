import { StringUtils } from "./StringUtils"

interface Props<T> {
    entity: T[]
    page: number
}

export function activeFilter<T extends { isActive: boolean }>(entity: T[]): T[] {
    return entity.filter(it => it.isActive)
}

export function filterAndPaginate<T>({ entity, page }: Props<T>): T[] {
    return entity
        .slice(
            page * StringUtils.ROWS_PER_PAGE,
            page * StringUtils.ROWS_PER_PAGE + StringUtils.ROWS_PER_PAGE
        )
}