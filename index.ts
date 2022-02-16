import React, { useState } from 'react'

interface IPaginationProps {
    current?: number //默认的当前页数
    pageSize?: number //默认的每页条数
    beforeAfterPageNum?: number
    onlyPrevAndNext?: boolean
    hideOnSinglePage?: boolean //只有一页时是否隐藏分页器
    total: number //数据总数
    onChange: (page: number) => void
}

const Pagination: React.FC<IPaginationProps> = (props) => {
    // 最多展示五个页码
    let paginationNum = 5
    let {
        current = 1,
        pageSize = 10,
        beforeAfterPageNum = 2,
        hideOnSinglePage = true,
        total,
    } = props
    let totalPagination = Math.ceil(total / pageSize) || 1
    let [currentPage, setCurrentPage] = useState<number>(current)
    let [pageList, setPageList] = useState<number[]>(calcPagination())

    function calcPagination(currentPage = 1) {
        let list = []
        // 总页数小于等于最多展示的页码数量
        if (totalPagination <= paginationNum) {
            for (let i = 1; i <= totalPagination; i++) {
                list.push(i)
            }
        }
        // 总页数大于最多展示的页码数量
        if (totalPagination > paginationNum) {
            // 分段展示会逻辑
            // 当 当前页码 + 前后环绕数量 小于 最小页码展示数量 时，按照最小页码展示数量渲染
            if (currentPage + beforeAfterPageNum <= paginationNum) {
                for (let i = 1; i <= paginationNum; i++) {
                    list.push(i)
                }
                // 把最后一页的页码插进来
                list.push(-1)
                list.push(totalPagination)
            } else if (currentPage + beforeAfterPageNum > paginationNum) {
                // 环绕效果开启后的最大页码
                let maxPagination = currentPage + beforeAfterPageNum
                // 环绕效果开启后的最小页码
                let minPagination = currentPage - beforeAfterPageNum
                // 临时存储，用于补页码
                let diff = beforeAfterPageNum
                // 当环绕数超过总页码后，环绕数取总页码数
                if (maxPagination >= totalPagination) {
                    maxPagination = totalPagination
                }
                // 总页码数减去当前页码小于环绕数，需要在当前页码前面补页码
                diff = maxPagination - currentPage
                if (diff < beforeAfterPageNum) {
                    // 计算应该补几个页码
                    minPagination -= beforeAfterPageNum - diff
                }
                // 将第一页插入
                list.push(1)
                list.push(-1)
                for (let i = minPagination; i <= maxPagination; i++) {
                    list.push(i)
                }
                // 插入最后页码
                if (
                    maxPagination < totalPagination &&
                    totalPagination - maxPagination >= 2
                ) {
                    list.push(-1)
                }
                if (maxPagination < totalPagination) {
                    list.push(totalPagination)
                }
            }
        }
        return list
    }

    function handlePageChange(nextPagination) {
        if (nextPagination < 1 || nextPagination > totalPagination) {
            return
        }
        setCurrentPage(nextPagination)
        setPageList(calcPagination(nextPagination))
        props.onChange && props.onChange(nextPagination)
    }

    return (
        <div className={'pagination-w'}>
        <span
            onClick={() => handlePageChange(currentPage - 1)}
    className={
        currentPage == 1
        ? 'pagination-item-prev-disabled'
        : 'pagination-item-prev'
}
>
    上一页
    </span>
    {!props.onlyPrevAndNext &&
    pageList.map((item) => {
        return item == -1 ? (
            <span key={item} className={'pagination-item-dot'}>
            {'...'}
            </span>
    ) : (
            <span
                key={item}
        onClick={() => handlePageChange(item)}
        className={
            currentPage == item
            ? 'pagination-item-active'
            : 'pagination-item'
    }
    >
        {item}
        </span>
    )
    })}
    <span
        onClick={() => handlePageChange(currentPage + 1)}
    className={
        currentPage == totalPagination
        ? 'pagination-item-next-disabled'
        : 'pagination-item-next'
}
>
    下一页
    </span>
    </div>
)
}

export default Pagination
