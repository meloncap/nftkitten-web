import {
  FixedSizeGrid as Grid,
  GridChildComponentProps,
  GridOnItemsRenderedProps,
  GridOnScrollProps,
  ListOnItemsRenderedProps,
} from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import InfinityLoader from 'react-window-infinite-loader'
import {
  ComponentType,
  useCallback,
  useRef,
  useState,
  CSSProperties,
} from 'react'
import classNames from 'classnames'

type AutoSizeGridChildComponentProps<T> = GridChildComponentProps<T> & {
  width: number
  height: number
  index: number
  rows: T[]
  containerWidth: number
  containerHeight: number
}

type AutoSizeGridWithContainerSizeAndLoaderProps<T> =
  AutoSizeGridWithContainerSizeProps<T> & {
    // eslint-disable-next-line no-unused-vars
    loaderOnItemsRendered: (props: ListOnItemsRenderedProps) => any
    // eslint-disable-next-line no-unused-vars
    loaderRef: (ref: any) => void
  }

function AutoSizeGridWithContainerSizeAndLoader<T>({
  width,
  height,
  itemData,
  useIsScrolling,
  children: Children,
  containerWidth,
  containerHeight,
  loaderOnItemsRendered,
  loaderRef,
}: AutoSizeGridWithContainerSizeAndLoaderProps<T>) {
  const outerRef = useRef<HTMLDivElement>()
  const [isScrollBackward, setIsScrollBackward] = useState(false)
  const [ref, setRef] = useState<Grid | null>(null)
  const onScroll = useCallback(
    (props: GridOnScrollProps) => {
      if (props.verticalScrollDirection === 'forward' && props.scrollTop > 0) {
        outerRef.current?.scrollIntoView({
          behavior: 'smooth',
        })
      } else if (
        props.verticalScrollDirection === 'backward' &&
        props.scrollTop <= 0
      ) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth',
        })
        setIsScrollBackward(false)
      } else {
        setIsScrollBackward(
          props.verticalScrollDirection === 'backward' &&
            (window.scrollY > 0 || props.scrollTop > 0)
        )
      }
    },
    [outerRef, setIsScrollBackward]
  )
  const scrollClickHandler = useCallback(() => {
    window.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
    ref?.scrollTo({ scrollTop: 0 })
    setIsScrollBackward(false)
  }, [ref, setIsScrollBackward])
  const onItemsRendered = useCallback(
    (props: GridOnItemsRenderedProps) => {
      loaderOnItemsRendered({
        overscanStartIndex: props.overscanRowStartIndex,
        overscanStopIndex: props.overscanRowStopIndex,
        visibleStartIndex: props.visibleRowStartIndex,
        visibleStopIndex: props.visibleRowStopIndex,
      })
    },
    [loaderOnItemsRendered]
  )
  return (
    <>
      <button
        type='button'
        data-mdb-ripple='true'
        data-mdb-ripple-color='light'
        className={classNames(
          'fixed inline-block right-5 bottom-5 p-3 text-xs font-medium leading-tight text-white uppercase bg-blue-600 hover:bg-blue-700 focus:bg-blu-700 active:bg-blue-800 rounded-full focus:outline-none focus:ring-0 shadow-md hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out z-10',
          { hidden: !isScrollBackward }
        )}
        onClick={scrollClickHandler}
      >
        <svg
          aria-hidden='true'
          focusable='false'
          data-prefix='fas'
          className='w-4 h-4'
          role='img'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 448 512'
        >
          <path
            fill='currentColor'
            d='M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z'
          ></path>
        </svg>
      </button>
      <Grid
        outerRef={outerRef}
        onScroll={onScroll}
        columnCount={~~(containerWidth / width)}
        columnWidth={width}
        rowCount={Math.ceil(
          (itemData?.length ?? 0) / ~~(containerWidth / width)
        )}
        rowHeight={height}
        onItemsRendered={onItemsRendered}
        overscanRowCount={10}
        useIsScrolling={useIsScrolling}
        ref={(ref) => {
          setRef(ref)
          loaderRef(ref)
        }}
        width={containerWidth}
        height={containerHeight}
        itemData={itemData ?? []}
      >
        {({ columnIndex, rowIndex, isScrolling, data: rows, style }) => (
          <GridItem
            containerWidth={containerWidth}
            containerHeight={containerHeight}
            width={width}
            height={height}
            columnIndex={columnIndex}
            rowIndex={rowIndex}
            isScrolling={isScrolling}
            rows={rows}
            style={style}
            Children={Children}
          />
        )}
      </Grid>
    </>
  )
}

type GridItemProps<T> = {
  containerWidth: number
  containerHeight: number
  width: number
  height: number
  columnIndex: number
  rowIndex: number
  isScrolling: boolean | undefined
  rows: T[]
  style: CSSProperties
  Children: ComponentType<AutoSizeGridChildComponentProps<T>>
}

function GridItem<T>({
  containerWidth,
  containerHeight,
  width,
  height,
  columnIndex,
  rowIndex,
  isScrolling,
  rows,
  style,
  Children,
}: GridItemProps<T>) {
  const numOfCol = ~~(containerWidth / width)
  const index = rowIndex * numOfCol + columnIndex
  const data = rows[index]
  const marginLeft =
    ((1 + columnIndex) * ((containerWidth % width) / 2)) / numOfCol
  if (!data) {
    return null
  }
  return (
    <Children
      columnIndex={columnIndex}
      rowIndex={rowIndex}
      index={index}
      isScrolling={isScrolling}
      data={data}
      style={{ ...style, marginLeft }}
      width={width}
      height={height}
      containerWidth={containerWidth}
      containerHeight={containerHeight}
      rows={rows}
    />
  )
}

type AutoSizeGridWithContainerSizeProps<T> = AutoSizeGridProps<T> & {
  containerWidth: number
  containerHeight: number
}

function AutoSizeGridWithContainerSize<T>(
  props: AutoSizeGridWithContainerSizeProps<T>
) {
  const { hasMore, pageSize, itemData, loadMoreItems, containerWidth, width } =
    props
  const isItemLoaded = useCallback(
    (index: number) => {
      if (!itemData) return true
      const numOfCol = ~~(containerWidth / width)
      return Math.ceil(itemData.length / numOfCol) >= index
    },
    [itemData, containerWidth, width]
  )
  return (
    <InfinityLoader
      isItemLoaded={isItemLoaded}
      itemCount={
        (itemData?.length ?? 0) + (hasMore ?? false ? pageSize ?? 10 : 0)
      }
      loadMoreItems={loadMoreItems}
      minimumBatchSize={pageSize}
      threshold={10}
    >
      {({ onItemsRendered, ref }) => (
        <AutoSizeGridWithContainerSizeAndLoader
          {...props}
          loaderOnItemsRendered={onItemsRendered}
          loaderRef={ref}
        />
      )}
    </InfinityLoader>
  )
}

type AutoSizeGridProps<T> = {
  hasMore?: boolean | undefined
  pageSize?: number | undefined
  width: number
  height: number
  itemData: T[] | undefined
  // eslint-disable-next-line no-unused-vars
  loadMoreItems: (startIndex: number, stopIndex: number) => void | Promise<void>
  useIsScrolling?: boolean | undefined
  // eslint-disable-next-line no-unused-vars
  children: ComponentType<AutoSizeGridChildComponentProps<T>>
}

export function AutoSizeGrid<T>(props: AutoSizeGridProps<T>) {
  return (
    <AutoSizer>
      {({ width, height }) => (
        <AutoSizeGridWithContainerSize
          {...props}
          containerWidth={width}
          containerHeight={height}
        />
      )}
    </AutoSizer>
  )
}
