import { usePostsStore } from "../../../store/usePostsStore";
import classes from './feedback-modal.module.css'
function FeedbackModal() {
	const { showFeedbackModal, closeFeedbackModal } = usePostsStore((state) => ({
		showFeedbackModal: state.showFeedbackModal,
		closeFeedbackModal: state.closeFeedbackModal,
	}));
	return (
		<div>
			{showFeedbackModal.show && <div>
            <div className={classes.backdrop} onClick={closeFeedbackModal}></div>
			<div className={classes.modal}>
				<h3>{showFeedbackModal.title}</h3>
				<p>{showFeedbackModal.message}</p>
			</div>
            </div>}
		</div>
	);
}
export default FeedbackModal;
