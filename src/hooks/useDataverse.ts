import { useEffect, useState } from 'react';
import { getXrm } from '../utils/xrmUtils';

interface WorkOrder {
    id: string;
    name: string;
}

interface EventData {
    id: string;
    title: string;
    start: string;
    end: string;
}

interface DataverseReturn {
    dataverseInfo: string;
    workOrders: WorkOrder[];
    events: EventData[];
    selectedWO: string;
    setSelectedWO: (id: string) => void;
}

export const useDataverse = (): DataverseReturn => {
    const [dataverseInfo, setDataverseInfo] = useState('読み込み中...');
    const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
    const [events, setEvents] = useState<EventData[]>([]);
    const [selectedWO, setSelectedWO] = useState('');

    // ✅ Dataverse WorkOrder取得
    useEffect(() => {
        const xrm = getXrm();
        if (!xrm) {
            setDataverseInfo('⚠️ Dataverse 環境外です。');
            return;
        }

        const globalCtx = xrm.Utility.getGlobalContext();
        const user = globalCtx.userSettings;
        const userId = user.userId.replace(/[{}]/g, '');
        const entityName = 'proto_workorder';
        const query = `?$select=proto_workorderid,proto_wonumber&$filter=_createdby_value eq ${userId}`;

        xrm.WebApi.retrieveMultipleRecords(entityName, query)
            .then((result: any) => {
                const woList = result.entities.map((item: any) => ({
                    id: item.proto_workorderid,
                    name: item.proto_wonumber || '(名称未設定)',
                }));
                setWorkOrders(woList);
            })
            .catch(() => setDataverseInfo('❌ WorkOrder取得失敗'));
    }, []);

    // ✅ Dataverse Event取得
    useEffect(() => {
        const xrm = getXrm();
        if (!xrm) return;

        const userId = xrm.Utility.getGlobalContext().userSettings.userId.replace(/[{}]/g, '');
        const entityName = 'proto_workorder';
        const navigationName = 'proto_timeentry_wonumber_proto_workorder';

        const query =
            `?$select=proto_workorderid&$filter=_createdby_value eq ${userId}` +
            `&$expand=${navigationName}(` +
            `$select=proto_timeentryid,proto_startdatetime,proto_enddatetime,proto_name)`;

        xrm.WebApi.retrieveMultipleRecords(entityName, query)
            .then((result: any) => {
                const formattedEvents = result.entities.flatMap((p: any) =>
                    (p[navigationName] || []).map((child: any) => ({
                        id: child.proto_timeentryid,
                        title: child.proto_name || '関連レコード',
                        start: child.proto_startdatetime,
                        end: child.proto_enddatetime,
                    }))
                );
                setEvents(formattedEvents);
            })
            .catch(() => setDataverseInfo('❌ Event取得失敗'));
    }, []);

    return { dataverseInfo, workOrders, events, selectedWO, setSelectedWO };
};
