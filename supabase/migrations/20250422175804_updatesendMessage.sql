drop function insert_message_and_update_sequence;
CREATE OR REPLACE FUNCTION insert_message_and_update_sequence(
  p_channel_id integer,
  p_content TEXT,
  p_sender_id UUID
) RETURNS TABLE (message_id INTEGER) AS $$
DECLARE
  v_last_sequence INTEGER;
BEGIN
  -- Lock the row to prevent race conditions
  SELECT last_sequence INTO v_last_sequence
  FROM last_sequence
  WHERE channel_id = p_channel_id
  FOR UPDATE;

  -- Insert the message with the composite primary key
  INSERT INTO messages (content, message_id, channel_id, sender_id)
  VALUES (p_content, v_last_sequence, p_channel_id, p_sender_id);

  -- Update the sequence
  UPDATE last_sequence
  SET last_sequence = v_last_sequence + 1
  WHERE channel_id = p_channel_id;

  -- Return the message_id for confirmation
  RETURN QUERY SELECT v_last_sequence;
END;
$$ LANGUAGE plpgsql;