import { FC } from 'react'
import styles from '../styles/loading.module.css'

const LoadingScreen: FC = () => {
  return (
    <div className={styles.loading}>
      <p>LOADING...</p>
      <i>
        <b>N</b>
        <b>F</b>
        <b>T</b>
        <b>K</b>
        <b>i</b>
        <b>t</b>
        <b>t</b>
        <b>e</b>
        <b>n</b>
        <b>.</b>
        <b>i</b>
        <b>o</b>
      </i>
    </div>
  )
}
export default LoadingScreen
