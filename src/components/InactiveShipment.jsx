import React, { useEffect, useState } from 'react'
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import supabase from '../supabaseClient';

const InactiveShipment = () => {
    const [loading, setLoading] = useState(false);
    const [shipments, setShipments] = useState([]);

    useEffect(() => {
        fetchStatusShipments();
      }, []);

    const fetchStatusShipments = async () => {
        setLoading(true);
        const now = new Date();
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
        const fiveMinutesAgo = new Date(now - 5 * 60 * 1000).toISOString(); // 5 minutes ago
        const thirtySixHoursAgo = new Date(now - 36 * 60 * 60 * 1000).toISOString(); // 36 hours ago

        const { data, error } = await supabase
          .from('shipments')
          .select('shipment_id, tracking_no, status, status_updated_at, current_user_name')
          .not('status_updated_at', 'is', null)
          .lt('status_updated_at', fiveMinutesAgo) 
          .order('status_updated_at', { ascending: false }); // Get the latest updates first
    
        if (error) {
          console.error('Error fetching shipments:', error);
        } else {
          setShipments(data || []);
        }
        setLoading(false);
    };

    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
        const intervals = [
          { label: 'year', seconds: 31536000 },
          { label: 'month', seconds: 2592000 },
          { label: 'week', seconds: 604800 },
          { label: 'day', seconds: 86400 },
          { label: 'hour', seconds: 3600 },
          { label: 'minute', seconds: 60 },
          { label: 'second', seconds: 1 },
        ];
    
        for (const interval of intervals) {
          const count = Math.floor(seconds / interval.seconds);
          if (count > 0) {
            return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
          }
        }
    
        return 'just now';
      };
    



  return (
    <div>
      {loading ? (
        <div className="h-auto flex w-full">
          <div className="loader mx-auto bg-blue"></div>
        </div>
      ) : (
        <div className="w-full h-auto">
          <div className="">
            {shipments.length > 0 ? (
                <Table className="min-w-full table-auto border-collapse border border-gray-300">
              <Thead>
                <Tr className="bg-gray-200 text-left">
                  <Th className="px-8 py-3 border-b border-gray-300 text-nowrap">Tracking No</Th>
                  <Th className="px-8 py-3 border-b border-gray-300 text-nowrap">User name</Th>
                  <Th className="px-8 py-3 border-b border-gray-300 text-nowrap">Status</Th>
                  <Th className="px-8 py-3 border-b border-gray-300 text-nowrap">Last Update</Th>
                </Tr>
              </Thead>
              <Tbody>
                {shipments.map((shipment, index) => (
                  <Tr
                    key={index}
                    className="hover:bg-gray-100"
                    // onClick={() => onRowClick(shipment)}
                  >
                    <Td className="px-8 py-3 border-b border-gray-300 bg-[#e5e7eb] truncate">
                      {shipment.tracking_no}
                    </Td>
                    <Td className="px-8 border-b border-gray-300 truncate">
                      {shipment.current_user_name}
                    </Td>
                    <Td className="px-8 border-b border-gray-300 truncate">
                      {shipment.status}
                    </Td>
                    <Td className="px-8 border-b border-gray-300 truncate">
                      {timeAgo(shipment.status_updated_at)}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            ):(
            <div className='text-center w-full'>
                No Inactive Shipments
            </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default InactiveShipment
