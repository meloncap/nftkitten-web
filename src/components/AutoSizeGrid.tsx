/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
import {
  FixedSizeGrid as Grid,
  GridChildComponentProps,
  GridOnItemsRenderedProps,
  GridProps,
  ListOnItemsRenderedProps,
} from 'react-window'
import InfinityLoader from 'react-window-infinite-loader'
import {
  ComponentType,
  useCallback,
  useRef,
  useState,
  HTMLProps,
  forwardRef,
  useMemo,
  ForwardedRef,
  MutableRefObject,
  CSSProperties,
} from 'react'
import classNames from 'classnames'
import { useScroll } from '@use-gesture/react'
import { useWindowSize } from 'usehooks-ts'

type AutoSizeGridProps<T> = {
  pageSize?: number | undefined
  width: number
  height: number
  itemData: T[] | undefined
  loadMoreItems?:
    | ((startIndex: number, stopIndex: number) => void | Promise<void>)
    | undefined
  useIsScrolling?: boolean | undefined
  children: ComponentType<AutoSizeGridChildComponentProps<T>>
}

type GridWithSizeProps<T> = AutoSizeGridProps<T> & {
  containerWidth: number
  containerHeight: number
}

type AutoSizeGridChildComponentProps<T> = GridChildComponentProps<T> & {
  width: number
  height: number
  index: number
  rows: T[]
  containerWidth: number
  containerHeight: number
}

type GridWithLoaderProps<T> = GridWithSizeProps<T> & {
  loaderOnItemsRendered: (props: ListOnItemsRenderedProps) => Grid
  loaderRef: (ref: Grid) => void
}

function clamp(value: number, clampAt: number = 20) {
  if (value > 0) {
    return value > clampAt ? clampAt : value
  } else {
    return value < -clampAt ? -clampAt : value
  }
}

function getNumOfCol(containerWidth: number, width: number) {
  return ~~(containerWidth / width)
}

function OuterElementType({
  style,
  forwardedRef,
  ...props
}: HTMLProps<HTMLDivElement> & {
  forwardedRef: MutableRefObject<HTMLDivElement>
}) {
  const [isScrollBackward, setIsScrollBackward] = useState(false)
  const scrollClickHandler = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setIsScrollBackward(false)
  }, [setIsScrollBackward])
  const bind = useScroll(
    ({ movement: [_deltaX, deltaY] }) => {
      const newIsScrollBackward = deltaY < 0
      if (newIsScrollBackward != isScrollBackward) {
        setIsScrollBackward(newIsScrollBackward)
      }
      if (
        deltaY > 0 &&
        window.scrollY <
          document.documentElement.scrollHeight - window.innerHeight
      ) {
        window.scrollBy({ top: deltaY, behavior: 'auto' })
      }
    },
    {
      eventOptions: { capture: true },
    }
  )
  return (
    <>
      <div
        style={{
          ...style,
          height: '100vh',
        }}
        ref={forwardedRef}
        {...props}
        {...bind()}
      ></div>
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
    </>
  )
}

function InnerElementType({
  style,
  forwardedRef,
  ...props
}: HTMLProps<HTMLDivElement> & { forwardedRef: ForwardedRef<HTMLDivElement> }) {
  if (style?.height === Infinity) {
    return null
  }
  return <div style={style} ref={forwardedRef} {...props}></div>
}

function GridWithLoader<T>({
  width,
  height,
  itemData,
  useIsScrolling,
  children: Children,
  containerWidth,
  containerHeight,
  loadMoreItems,
  loaderOnItemsRendered,
  loaderRef,
}: GridWithLoaderProps<T>) {
  const gridRef = useRef<Grid>(null)
  const ref = useCallback(
    (newRef: Grid) => {
      loaderRef(newRef)
      return gridRef
    },
    [loaderRef]
  )
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
  const outerElementType = useMemo(
    () =>
      forwardRef<HTMLDivElement>((props, ref) => (
        <OuterElementType
          forwardedRef={ref as MutableRefObject<HTMLDivElement>}
          {...props}
        />
      )),
    []
  )
  const innerElementType = useMemo(
    () =>
      forwardRef<HTMLDivElement>((props, ref) => (
        <InnerElementType forwardedRef={ref} {...props} />
      )),
    []
  )
  const childCallback = useCallback(
    ({
      columnIndex,
      rowIndex,
      isScrolling,
      data: rows,
      style: gridStyle,
    }: {
      columnIndex: number
      rowIndex: number
      isScrolling?: boolean | undefined
      data: T[]
      style: CSSProperties
    }) => {
      const numOfCol = getNumOfCol(containerWidth, width)
      const index = rowIndex * numOfCol + columnIndex
      const data = rows[index]
      if (!data) {
        return null
      }
      const marginLeft =
        ((1 + columnIndex) * (containerWidth - numOfCol * width)) /
        (1 + numOfCol)
      const style = { ...gridStyle, marginLeft }
      return (
        <Children
          columnIndex={columnIndex}
          rowIndex={rowIndex}
          index={index}
          isScrolling={isScrolling}
          data={data}
          style={style}
          width={width}
          height={height}
          containerWidth={containerWidth}
          containerHeight={containerHeight}
          rows={rows}
        />
      )
    },
    [width, height, containerWidth, containerHeight, Children]
  )
  const columnCount = getNumOfCol(containerWidth, width)
  return (
    <Grid
      outerElementType={outerElementType}
      innerElementType={innerElementType}
      columnCount={columnCount}
      columnWidth={width}
      rowCount={
        Math.ceil((itemData?.length ?? 0) / columnCount) +
        (loadMoreItems ? columnCount : 0)
      }
      rowHeight={height}
      onItemsRendered={onItemsRendered}
      overscanRowCount={10}
      useIsScrolling={useIsScrolling}
      ref={ref}
      width={containerWidth}
      height={containerHeight}
      itemData={itemData ?? []}
    >
      {childCallback}
    </Grid>
  )
}

export function AutoSizeGrid<T>({
  pageSize,
  width,
  height,
  itemData,
  loadMoreItems,
  useIsScrolling,
  children,
}: AutoSizeGridProps<T>) {
  const { width: containerWidth, height: containerHeight } = useWindowSize()
  const isItemLoaded = useCallback(
    (index: number) => {
      if (!itemData) return true
      const numOfCol = getNumOfCol(containerWidth, width)
      return Math.ceil(itemData.length / numOfCol) >= index
    },
    [itemData, containerWidth, width]
  )
  return (
    <InfinityLoader
      isItemLoaded={isItemLoaded}
      itemCount={
        (itemData?.length ?? 0) +
        (loadMoreItems ? getNumOfCol(containerWidth, width) : 0)
      }
      loadMoreItems={loadMoreItems ?? (() => {})}
      minimumBatchSize={
        pageSize ? pageSize / getNumOfCol(containerWidth, width) : undefined
      }
      threshold={Math.ceil(100 / getNumOfCol(containerWidth, width))}
    >
      {useCallback(
        ({ onItemsRendered, ref }) => (
          <GridWithLoader
            pageSize={pageSize}
            itemData={itemData}
            loadMoreItems={loadMoreItems}
            containerWidth={containerWidth}
            containerHeight={containerHeight}
            width={width}
            loaderOnItemsRendered={onItemsRendered}
            loaderRef={ref}
            height={height}
            useIsScrolling={useIsScrolling}
          >
            {children}
          </GridWithLoader>
        ),
        [
          containerWidth,
          containerHeight,
          itemData,
          loadMoreItems,
          pageSize,
          width,
          height,
          useIsScrolling,
          children,
        ]
      )}
    </InfinityLoader>
  )
}
