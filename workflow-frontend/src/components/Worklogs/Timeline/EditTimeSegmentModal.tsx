import { Modal, Button} from 'react-bootstrap';
import type { UsersTimelineWorklogDto } from './UsersTimelineWorklogDto';
import moment from 'moment';
import { resolveActionRequest } from '../../../services/workLogService';
import { ResolveActionCommand } from '../../../enums/ResolveActionCommand';

const EditTimeSegmentModal = ({ segment, onClose, onActionResolved }: { segment: UsersTimelineWorklogDto, onClose: () => void, onActionResolved: () => void }) => {
    const handleResolve = async (action: ResolveActionCommand) => {
        try {
            await resolveActionRequest(segment.id, action);
            onActionResolved?.();
            onClose();
        } catch (e) {
            onClose();
        }
    };

    return (
        <Modal show onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Time Segment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <p><strong>Start Time:</strong> {moment.utc(segment.startTime).local().format('YYYY-MM-DD HH:mm:ss')}</p>
                    <p><strong>End Time:</strong> {segment.endTime ? moment.utc(segment.endTime).local().format('YYYY-MM-DD HH:mm:ss') : 'Still going'}</p>
                    <p><strong>Duration:</strong> {segment.durationInSeconds ? `${Math.floor(segment.durationInSeconds / 3600)}h ${Math.floor((segment.durationInSeconds % 3600) / 60)}m` : 'Still going'}</p>
                    <p><strong>Created At:</strong> {moment.utc(segment.createdAt).local().format('YYYY-MM-DD HH:mm:ss')}</p>
                </div>  
            </Modal.Body>
            <Modal.Footer>
                {segment.requestAction && (
                    <>
                        <Button variant="danger" className='ms-2 me-2' onClick={() => handleResolve(ResolveActionCommand.Reject)}>Rejected</Button>
                        <Button variant="success" className='ms-2 me-2' onClick={() => handleResolve(ResolveActionCommand.Approve)}>Accepted</Button>
                        <Button variant="primary" className='ms-2 me-2' onClick={() => handleResolve(ResolveActionCommand.SetStartTimeAsCreationDate)}>Set start as Creation Date</Button>
                    </>
                )}
                <Button variant="secondary" className='ms-2 me-2' onClick={onClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditTimeSegmentModal;
