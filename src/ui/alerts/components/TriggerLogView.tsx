import { h, Component } from '../../preact'
import IStorage from "../../../storage/IStorage";
import { getApiName } from "../../../notifier/BlockEvent";
import { trustedEventListener } from "../../utils/event_listener_decorators";
import Pages from './PagesEnum'

interface ITriggerLogViewProps {
    storage:IStorage
    toPage(index:number, timeout?:number):void
}

interface ITriggerLogViewState {
    selected:number
}

const SEC = 1000;
const MIN = SEC * 60;
const HOUR = MIN * 60;
const DAY = HOUR * 24;

export default class TriggerLogView extends Component<ITriggerLogViewProps, any> {
    constructor(props:ITriggerLogViewProps) {
        super(props);
        this.state = {
            selected: 0
        };
        this.onSelectionChange = trustedEventListener(this.onSelectionChange, this); 
        this.onBackBtnClick = trustedEventListener(this.onBackBtnClick, this);
    }
    private onBackBtnClick() {
        this.props.toPage(Pages.DETAILS);
    }
    private onSelectionChange(evt:UIEvent) {
        let value = parseInt((evt.currentTarget as HTMLSelectElement).value, 10);
        this.setState({
            selected: value
        });
    }
    private getElapsedTimeRepresentation(date:number):string {
        const now = Date.now();
        const elapsed = now - date;
        if (elapsed < SEC) {
            return `+${elapsed}ms`
        }
        if (elapsed < MIN) {
            return `+${Math.round(elapsed / SEC)}s`
        }
        if (elapsed < HOUR) {
            return `+${Math.round(elapsed / MIN)}m`
        }
        if (elapsed < DAY) {
            return `+${Math.round(elapsed / HOUR)}h`
        }
        return `+${Math.round(elapsed / DAY)}d`
    }
    render(props:ITriggerLogViewProps, state:ITriggerLogViewState) {
        const triggerLog = props.storage.getTriggerLog();
        return (
            <div class="popup__text">
                <div>
                    <div class="popup__back" onClick={this.onBackBtnClick}>back</div>
                    <select value={String(state.selected)} onChange={this.onSelectionChange}>
                        {triggerLog.map((entry, index) => {
                            return <option value={String(index)}>
                                {this.getElapsedTimeRepresentation(entry.date) + ' ' }
                                <div class="popup__text-api">
                                    {getApiName(entry.api, entry.type)}
                                </div>
                            </option>
                        })}
                    </select>
                </div>
                <div>
                    <textarea class="popup__stack" rows={10} cols={45}>
                        {triggerLog[state.selected].stack}
                    </textarea>
                </div>
            </div>
        )
    }
}
