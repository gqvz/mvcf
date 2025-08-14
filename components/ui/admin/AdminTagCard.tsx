import { GetTagResponse } from '@/lib/gen/models';
import React from 'react';
import { Button } from 'react-bootstrap';

export default function AdminTagCard({
  tag,
  onClick
}: {
  tag: GetTagResponse;
  onClick: (tag: GetTagResponse) => void;
}): React.JSX.Element {
  return (
    <tr>
      <td>{tag.id}</td>
      <td className="text-center">{tag.name}</td>
      <td className="text-end">
        <Button size="sm" variant="secondary" onClick={() => onClick(tag)}>
          Edit Tag
        </Button>
      </td>
    </tr>
  );
}
