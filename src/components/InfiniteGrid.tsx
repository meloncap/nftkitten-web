import {
  FixedSizeGrid as Grid,
  GridChildComponentProps,
  GridOnItemsRenderedProps,
  ListOnItemsRenderedProps,
} from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import {
  useCallback,
  useRef,
  HTMLProps,
  forwardRef,
  useMemo,
  ForwardedRef,
  MutableRefObject,
  CSSProperties,
  useEffect,
  ReactNode,
  FC,
  UIEvent,
} from 'react'
import { useWindowSize } from '../hooks/useWindowSize'
import { useScroll } from '@use-gesture/react'
import { useSpring, animated } from 'react-spring'

type GridWithSizeProps<T> = InfiniteGridProps<T> & {
  containerWidth: number
  containerHeight: number
}

type GridCallbackProps<T> = GridChildComponentProps<T> & {
  width: number
  height: number
  index: number
  containerWidth: number
  containerHeight: number
  children: ReactNode
}

type InfiniteGridProps<T> = {
  pageSize?: number | undefined
  width: number
  height: number
  itemData: T[] | undefined
  loadMoreItems?:
    | ((startIndex: number, stopIndex: number) => void | Promise<void>)
    | undefined
  useIsScrolling?: boolean | undefined
  gridCallback: FC<GridCallbackProps<T>>
  children?: ReactNode | undefined
}

type GridWithLoaderProps<T> = GridWithSizeProps<T> & {
  loaderOnItemsRendered: (props: ListOnItemsRenderedProps) => Grid
  loaderRef: (ref: Grid) => void
}

function getNumOfCol(containerWidth: number, width: number) {
  return ~~(containerWidth / width)
}

function OuterElementType({
  className: _className,
  style: _style,
  onScroll,
  forwardedRef,
  children,
}: HTMLProps<HTMLElement> & {
  forwardedRef: MutableRefObject<HTMLElement>
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [{ offsetY }, offsetYApi] = useSpring(() => ({ offsetY: 0 }))
  const [{ opacity }, opacityApi] = useSpring(() => ({ opacity: 0 }))
  const scrollClickHandler = useCallback(() => {
    opacityApi.start({ opacity: 0, immediate: true })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [opacityApi])
  useScroll(
    ({ offset: [_offsetX, offsetY], movement: [_deltaX, deltaY] }) => {
      const {
        clientHeight,
        clientWidth,
        scrollLeft,
        scrollTop,
        scrollHeight,
        scrollWidth,
      } = document.documentElement
      const isBackward = deltaY < 0
      offsetYApi.start({
        offsetY: offsetY / (scrollHeight - clientHeight),
      })
      opacityApi.start({
        opacity: offsetY < 100 || !isBackward ? 0 : 1,
        immediate: offsetY < 100 || isBackward,
      })
      if (onScroll instanceof Function) {
        onScroll({
          currentTarget: {
            clientHeight,
            clientWidth,
            scrollLeft,
            scrollTop:
              scrollTop -
              (containerRef.current
                ? containerRef.current.getBoundingClientRect().top + scrollTop
                : 0),
            scrollHeight,
            scrollWidth,
          },
        } as UIEvent<HTMLElement, globalThis.UIEvent>)
      }
    },
    {
      target: window,
    }
  )
  forwardedRef.current = document.documentElement
  return (
    <>
      <div className='sticky top-0 z-10 w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full'>
        <animated.div
          className='h-2.5 bg-blue-600 rounded-full'
          style={{ width: offsetY.to((y) => `${y * 100}%`) }}
        ></animated.div>
      </div>
      <div
        className='overflow-visible relative w-screen h-screen'
        ref={containerRef}
      >
        {children}
      </div>
      <animated.button
        type='button'
        className='inline-block fixed right-5 bottom-5 z-10 p-3 text-xs font-medium leading-tight text-white uppercase bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800 rounded-full focus:outline-none focus:ring-0 shadow-md hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out'
        style={{ opacity: opacity.to((x) => x) }}
        onClick={scrollClickHandler}
      >
        <svg
          aria-hidden='true'
          focusable='false'
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
      </animated.button>
    </>
  )
}

function InnerElementType({
  style,
  forwardedRef,
  ...props
}: HTMLProps<HTMLDivElement> & { forwardedRef: ForwardedRef<HTMLDivElement> }) {
  if (!style) {
    style = {}
  }
  style.width = '100%'
  if (!style.height || style.height === Infinity) {
    style.height = '100%'
  }
  return <div style={style} ref={forwardedRef} {...props}></div>
}

function GridWithLoader<T>({
  width,
  height,
  itemData,
  useIsScrolling,
  gridCallback,
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
    ({
      overscanRowStartIndex,
      overscanRowStopIndex,
      visibleRowStartIndex,
      visibleRowStopIndex,
    }: GridOnItemsRenderedProps) => {
      loaderOnItemsRendered({
        overscanStartIndex: overscanRowStartIndex,
        overscanStopIndex: overscanRowStopIndex,
        visibleStartIndex: visibleRowStartIndex,
        visibleStopIndex: visibleRowStopIndex,
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
      forwardRef<HTMLDivElement>(({ ...props }, ref) => (
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
      const marginLeft =
        ((1 + columnIndex) * (containerWidth - numOfCol * width)) /
        (1 + numOfCol)
      const style = { ...gridStyle, marginLeft }
      return gridCallback({
        columnIndex,
        rowIndex,
        index,
        isScrolling,
        data,
        style,
        width,
        height,
        containerWidth,
        containerHeight,
        children: undefined,
      })
    },
    [width, height, containerWidth, containerHeight, gridCallback]
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

export function InfiniteGrid<T>({
  pageSize,
  width,
  height,
  itemData,
  loadMoreItems,
  useIsScrolling,
  gridCallback,
  children,
}: InfiniteGridProps<T>) {
  const { width: containerWidth, height: containerHeight } = useWindowSize()
  const isItemLoaded = useCallback(
    (index: number) => {
      if (!itemData) {
        return true
      }
      const numOfCol = getNumOfCol(containerWidth, width)
      return Math.ceil(itemData.length / numOfCol) >= index
    },
    [itemData, containerWidth, width]
  )
  useEffect(() => {
    if (loadMoreItems && itemData) {
      const numOfCol = getNumOfCol(containerWidth, width)
      if (~~(itemData.length / numOfCol) * height <= containerHeight) {
        loadMoreItems(0, 0)
      }
    }
  }, [loadMoreItems, itemData, containerWidth, width, height, containerHeight])
  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={
        (itemData?.length ?? 0) +
        (loadMoreItems ? getNumOfCol(containerWidth, width) : 0)
      }
      loadMoreItems={
        loadMoreItems ??
        (() => {
          return
        })
      }
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
            gridCallback={gridCallback}
          >
            <div className='relative'>{children}</div>
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
          gridCallback,
          children,
        ]
      )}
    </InfiniteLoader>
  )
}
