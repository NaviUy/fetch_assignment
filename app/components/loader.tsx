import styles from "../css/loader.module.css";
export default function Loader() {
  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
        <div className={styles.shadow}></div>
        <div className={styles.shadow}></div>
        <div className={styles.shadow}></div>
      </div>
      <div className="mt-4">{"Fetching some cute puppies! Give us a sec :)"}</div>
    </>
  );
}
